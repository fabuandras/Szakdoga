<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Item;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index()
    {
        $inventories = Inventory::query()
            ->orderByDesc('id')
            ->limit(200)
            ->get()
            ->map(function (Inventory $inventory) {
                $stats = DB::table('inventory_items')
                    ->where('inventory_id', $inventory->id)
                    ->selectRaw('COUNT(*) as lines_count, COALESCE(SUM(system_quantity),0) as total_system_quantity, COALESCE(SUM(counted_quantity),0) as total_counted_quantity')
                    ->first();

                return [
                    'id' => $inventory->id,
                    'code' => $inventory->code,
                    'status' => $inventory->status,
                    'started_at' => optional($inventory->started_at)->toIso8601String(),
                    'closed_at' => optional($inventory->closed_at)->toIso8601String(),
                    'note' => $inventory->note,
                    'lines_count' => (int) ($stats->lines_count ?? 0),
                    'total_system_quantity' => (int) ($stats->total_system_quantity ?? 0),
                    'total_counted_quantity' => (int) ($stats->total_counted_quantity ?? 0),
                    'difference_total' => (int) (($stats->total_counted_quantity ?? 0) - ($stats->total_system_quantity ?? 0)),
                    'created_at' => optional($inventory->created_at)->toIso8601String(),
                ];
            });

        return response()->json($inventories);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $open = Inventory::query()->where('status', 'open')->first();
        if ($open) {
            return response()->json([
                'message' => 'Már van egy megkezdett leltárfolyamat. Előbb zárd le azt.',
                'inventory_id' => $open->id,
            ], 422);
        }

        $items = Item::query()
            ->orderBy('elnevezes')
            ->get(['cikk_szam', 'elnevezes', 'akt_keszlet']);

        $inventory = DB::transaction(function () use ($items, $data) {
            $inventory = Inventory::create([
                'code' => $this->generateInventoryCode(),
                'status' => 'open',
                'started_by' => Auth::id(),
                'started_at' => now(),
                'note' => $data['note'] ?? null,
            ]);

            $rows = [];
            $now = now();

            foreach ($items as $item) {
                $rows[] = [
                    'inventory_id' => $inventory->id,
                    'item_id' => (int) ($item->cikk_szam ?? 0),
                    'item_name' => (string) ($item->elnevezes ?? ''),
                    'item_sku' => (string) ($item->cikk_szam ?? ''),
                    'system_quantity' => (int) ($item->akt_keszlet ?? 0),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (! empty($rows)) {
                foreach (array_chunk($rows, 500) as $chunk) {
                    DB::table('inventory_items')->insert($chunk);
                }
            }

            $this->createInventoryNotification(
                'inventory_start',
                sprintf('Leltárfolyamat indítva: %s (%d tétel).', $inventory->code, $items->count()),
                [
                    'inventory_id' => $inventory->id,
                    'items_count' => $items->count(),
                ]
            );

            return $inventory;
        });

        return response()->json([
            'message' => 'A leltárfolyamat létrehozva.',
            'inventory' => $inventory,
        ], 201);
    }

    public function show($id)
    {
        $inventory = Inventory::query()->find($id);
        if (! $inventory) {
            return response()->json(['message' => 'A leltár nem található.'], 404);
        }

        $lines = DB::table('inventory_items')
            ->where('inventory_id', $inventory->id)
            ->orderBy('item_name')
            ->get();

        return response()->json([
            'inventory' => $inventory,
            'lines' => $lines,
        ]);
    }

    public function saveLine(Request $request, $id, $itemId)
    {
        $inventory = Inventory::query()->find($id);
        if (! $inventory) {
            return response()->json(['message' => 'A leltár nem található.'], 404);
        }

        if ($inventory->status !== 'open') {
            return response()->json(['message' => 'Csak megkezdett leltár módosítható.'], 422);
        }

        $data = $request->validate([
            'counted_quantity' => ['required', 'integer', 'min:0'],
            'damaged_quantity' => ['nullable', 'integer', 'min:0'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $item = Item::query()->where('cikk_szam', $itemId)->first();
        if (! $item) {
            return response()->json(['message' => 'A termék nem található.'], 404);
        }

        $line = DB::table('inventory_items')
            ->where('inventory_id', $inventory->id)
            ->where('item_id', (int) $item->cikk_szam)
            ->first();

        $damaged = (int) ($data['damaged_quantity'] ?? 0);
        $counted = (int) $data['counted_quantity'];

        if ($damaged > $counted) {
            return response()->json(['message' => 'A sérült mennyiség nem lehet több, mint a számolt mennyiség.'], 422);
        }

        $effectiveCounted = max(0, $counted - $damaged);
        $systemQuantity = (int) ($line->system_quantity ?? (int) ($item->akt_keszlet ?? 0));
        $difference = $effectiveCounted - $systemQuantity;

        if ($line) {
            DB::table('inventory_items')
                ->where('id', $line->id)
                ->update([
                    'counted_quantity' => $counted,
                    'damaged_quantity' => $damaged,
                    'difference' => $difference,
                    'note' => $data['note'] ?? null,
                    'counted_by' => Auth::id(),
                    'counted_at' => now(),
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('inventory_items')->insert([
                'inventory_id' => $inventory->id,
                'item_id' => (int) $item->cikk_szam,
                'item_name' => (string) ($item->elnevezes ?? ''),
                'item_sku' => (string) ($item->cikk_szam ?? ''),
                'system_quantity' => $systemQuantity,
                'counted_quantity' => $counted,
                'damaged_quantity' => $damaged,
                'difference' => $difference,
                'note' => $data['note'] ?? null,
                'counted_by' => Auth::id(),
                'counted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $line = DB::table('inventory_items')
            ->where('inventory_id', $inventory->id)
            ->where('item_id', (int) $item->cikk_szam)
            ->first();

        $this->createInventoryNotification(
            'inventory_count',
            sprintf(
                'Leltár rögzítés: %s (%s) - rendszer: %d, számolt: %d, sérült: %d, eltérés: %+d.',
                $line->item_name,
                $line->item_sku,
                $systemQuantity,
                $counted,
                $damaged,
                $difference
            ),
            [
                'inventory_id' => $inventory->id,
                'item_id' => (int) $line->item_id,
                'counted_quantity' => $counted,
                'damaged_quantity' => $damaged,
                'effective_counted_quantity' => $effectiveCounted,
                'difference' => $difference,
            ],
            (int) $line->item_id,
            (string) $line->item_name,
            $difference
        );

        return response()->json([
            'message' => 'Leltár sor rögzítve.',
            'line' => $line,
            'effective_counted_quantity' => $effectiveCounted,
        ]);
    }

    public function close($id)
    {
        $inventory = Inventory::query()->find($id);
        if (! $inventory) {
            return response()->json(['message' => 'A leltár nem található.'], 404);
        }

        if ($inventory->status !== 'open') {
            return response()->json(['message' => 'A leltár már lezárt.'], 422);
        }

        DB::transaction(function () use ($inventory) {
            $lines = DB::table('inventory_items')
                ->where('inventory_id', $inventory->id)
                ->get();

            foreach ($lines as $line) {
                if ($line->counted_quantity === null) {
                    continue;
                }

                $effectiveCounted = max(0, (int) $line->counted_quantity - (int) ($line->damaged_quantity ?? 0));

                $item = Item::query()->where('cikk_szam', $line->item_id)->first();
                if (! $item) {
                    continue;
                }

                $item->akt_keszlet = $effectiveCounted;
                if (property_exists($item, 'statusz') || array_key_exists('statusz', $item->getAttributes())) {
                    $item->statusz = $effectiveCounted > 0 ? 'Aktív' : 'Inaktív';
                }
                $item->save();
            }

            $inventory->status = 'closed';
            $inventory->closed_by = Auth::id();
            $inventory->closed_at = now();
            $inventory->save();

            $countedRows = $lines->filter(fn ($line) => $line->counted_quantity !== null)->count();
            $differenceTotal = (int) $lines->sum('difference');

            $this->createInventoryNotification(
                'inventory_close',
                sprintf(
                    'Leltár lezárva: %s. Rögzített sorok: %d, összes eltérés: %+d.',
                    $inventory->code,
                    $countedRows,
                    $differenceTotal
                ),
                [
                    'inventory_id' => $inventory->id,
                    'counted_rows' => $countedRows,
                    'difference_total' => $differenceTotal,
                ]
            );
        });

        return response()->json([
            'message' => 'A leltár sikeresen lezárva.',
        ]);
    }

    private function generateInventoryCode(): string
    {
        return 'LELTAR-'.now()->format('Ymd-His');
    }

    private function resolveActorName(): ?string
    {
        $user = Auth::user();
        if (! $user) {
            $headerName = trim((string) request()->header('X-Actor-Name', ''));
            return $headerName !== '' ? $headerName : null;
        }

        if (! empty($user->name)) {
            return (string) $user->name;
        }

        if (! empty($user->felhasznalonev)) {
            return (string) $user->felhasznalonev;
        }

        $fullName = trim(($user->vez_nev ?? '').' '.($user->ker_nev ?? ''));
        if ($fullName !== '') {
            return $fullName;
        }

        if (! empty($user->username)) {
            return (string) $user->username;
        }

        if (! empty($user->email)) {
            return (string) $user->email;
        }

        $headerName = trim((string) request()->header('X-Actor-Name', ''));
        return $headerName !== '' ? $headerName : null;
    }

    private function createInventoryNotification(
        string $type,
        string $message,
        array $data = [],
        ?int $itemId = null,
        ?string $itemName = null,
        ?int $quantity = null
    ): void {
        try {
            Notification::create([
                'type' => $type,
                'message' => $message,
                'item_id' => $itemId,
                'item_name' => $itemName,
                'inventory_id' => $data['inventory_id'] ?? null,
                'quantity' => $quantity,
                'user_id' => Auth::id(),
                'user_name' => $this->resolveActorName(),
                'reason' => 'Leltár',
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            // log creation failures without breaking inventory flow
            logger()->warning('Inventory notification create failed', ['error' => $e->getMessage()]);
        }
    }
}
