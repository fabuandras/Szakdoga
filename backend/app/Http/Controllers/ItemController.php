<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use App\Models\Notification;

class ItemController extends Controller
{
    private const MAX_AKT_KESZLET = 2147483647;

    /** Cached Schema::hasColumn results — persists across requests within the same worker */
    private static array $colCache = [];

    private static function col(string $column): bool
    {
        if (! array_key_exists($column, self::$colCache)) {
            self::$colCache[$column] = Schema::hasColumn('items', $column);
        }
        return self::$colCache[$column];
    }

    // Lista lekérése
    public function index()
    {
        if (self::col('raktarhely')) {
            $nullItems = Item::whereNull('raktarhely')->orWhere('raktarhely', '')->get();
            foreach ($nullItems as $item) {
                $item->raktarhely = $this->inferRackLocationForItem($item);
                $item->saveQuietly();
            }
        }
        return response()->json(Item::all());
    }

    // Új tétel létrehozása
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'elnevezes' => ['required', 'string', 'max:50'],
                'akt_keszlet' => ['required', 'integer', 'min:0', 'max:'.self::MAX_AKT_KESZLET],
                'egyseg_ar' => ['required', 'numeric', 'min:0'],
                'kategoria' => ['nullable', 'string', 'max:50'],
                'raktarhely' => ['nullable', 'string', 'max:20'],
                'kep_url' => [
                    'nullable',
                    'string',
                    'max:10000',
                    function ($attribute, $value, $fail) {
                        if (is_string($value) && Str::startsWith($value, 'data:image/')) {
                            $fail('A beillesztett base64 kep helyett hasznald a kepfeltoltest.');
                        }
                    },
                ],
                'kep_file' => ['nullable', 'file', 'image', 'max:4096'],
                'kartya_hatterszin' => ['nullable', 'string', 'max:20'],
                'kartya_stilus' => ['nullable', 'string', 'max:50'],
            ]);

            if ($request->hasFile('kep_file')) {
                $data['kep_url'] = $this->storeOptimizedImage($request->file('kep_file'));
            }

            if (empty($data['kategoria'])) {
                $data['kategoria'] = $this->inferCategoryFromName($data['elnevezes'] ?? '');
            }

            if (empty($data['raktarhely'])) {
                $data['raktarhely'] = $this->inferRackLocationFromValues($data['kategoria'], $data['cikk_szam'] ?? null, $data['elnevezes'] ?? '');
            }

            if (! self::col('raktarhely')) {
                unset($data['raktarhely']);
            }

            // egyszerű létrehozás: bemenetet átmásoljuk (feltételezve, hogy a modell $fillable be van állítva)
            $item = Item::create($data);

            // activity log for create
            try {
                Notification::create([
                    'type' => 'create',
                    'message' => sprintf('Új termék létrehozva: %s', $item->elnevezes),
                    'item_id' => $item->id ?? null,
                    'item_name' => $item->elnevezes ?? null,
                    'quantity' => $item->akt_keszlet ?? null,
                    'user_id' => Auth::id(),
                    'user_name' => $this->resolveActorName(),
                    'note' => $request->input('note') ?: $request->input('megjegyzes'),
                ]);
            } catch (\Throwable $e) {
                Log::warning('Notification create failed for create', ['error' => $e->getMessage()]);
            }

            return response()->json($item, Response::HTTP_CREATED);
        } catch (ValidationException $exception) {
            return response()->json([
                'message' => collect($exception->errors())->flatten()->first() ?? 'Érvénytelen adatok.',
                'errors' => $exception->errors(),
            ], 422);
        } catch (QueryException $exception) {
            $errorMessage = (string) $exception->getMessage();
            if ($exception->getCode() === '22003' && str_contains($errorMessage, 'akt_keszlet')) {
                return response()->json([
                    'message' => 'A készlet értéke túl nagy. Maximális érték: '.self::MAX_AKT_KESZLET.'.',
                ], 422);
            }

            Log::error('Item create query failed', [
                'message' => $errorMessage,
            ]);

            return response()->json(['message' => 'A termek mentese sikertelen.'], 500);
        } catch (\Throwable $exception) {
            Log::error('Item create failed', [
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

            $message = config('app.debug')
                ? $exception->getMessage()
                : 'A termek mentese sikertelen.';

            return response()->json(['message' => $message], 500);
        }
    }

    // Egy tétel lekérése
    public function show($id)
    {
        $item = $this->findItemByIdOrCikk($id);
        if (! $item) {
            return response()->json(['message' => 'A tétel nem található.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($item);
    }

    // Egy tétel frissítése
    public function update(Request $request, $id)
    {
        $item = $this->findItemByIdOrCikk($id);
        if (! $item) {
            return response()->json(['message' => 'A tétel nem található.'], Response::HTTP_NOT_FOUND);
        }

        $data = $request->validate([
            'elnevezes' => ['sometimes', 'required', 'string', 'max:50'],
            'akt_keszlet' => ['sometimes', 'required', 'integer', 'min:0', 'max:'.self::MAX_AKT_KESZLET],
            'egyseg_ar' => ['sometimes', 'required', 'numeric', 'min:0'],
            'kategoria' => ['nullable', 'string', 'max:50'],
            'raktarhely' => ['nullable', 'string', 'max:20'],
            'kep_url' => [
                'nullable',
                'string',
                'max:10000',
                function ($attribute, $value, $fail) {
                    if (is_string($value) && Str::startsWith($value, 'data:image/')) {
                        $fail('A beillesztett base64 kep helyett hasznald a kepfeltoltest.');
                    }
                },
            ],
            'kep_file' => ['nullable', 'file', 'image', 'max:4096'],
            'kartya_hatterszin' => ['nullable', 'string', 'max:20'],
            'kartya_stilus' => ['nullable', 'string', 'max:50'],
        ]);

        if ($request->hasFile('kep_file')) {
            $oldPath = $this->extractPublicStoragePath($item->kep_url);
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $data['kep_url'] = $this->storeOptimizedImage($request->file('kep_file'));
        }

        if (! self::col('raktarhely')) {
            unset($data['raktarhely']);
        }

        $oldStock = $item->akt_keszlet;

        $item->update($data);

        // activity log for stock change (bevételezés)
        if (array_key_exists('akt_keszlet', $data)) {
            try {
                $newStock = (int) $item->akt_keszlet;
                $qty = $newStock - (int) ($oldStock ?? 0);
                Notification::create([
                    'type' => 'bevetelez',
                    'message' => sprintf('A(z) "%s" termék készlete módosult: %d → %d (változás: %+d).', $item->elnevezes, $oldStock, $newStock, $qty),
                    'item_id' => $item->id ?? null,
                    'item_name' => $item->elnevezes ?? null,
                    'quantity' => $qty,
                    'user_id' => Auth::id(),
                    'user_name' => $this->resolveActorName(),
                    'note' => $request->input('note') ?: $request->input('megjegyzes'),
                ]);
            } catch (\Throwable $e) {
                Log::warning('Notification create failed for update', ['error' => $e->getMessage()]);
            }
        }

        return response()->json($item);
    }

    // Egy tétel törlése
    public function destroy($id)
    {
        $item = $this->findItemByIdOrCikk($id);
        if (! $item) {
            return response()->json(['message' => 'A tétel nem található.'], Response::HTTP_NOT_FOUND);
        }

        $oldPath = $this->extractPublicStoragePath($item->kep_url);
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $item->delete();

        // activity log for delete
        try {
            Notification::create([
                'type' => 'delete',
                'message' => sprintf('A(z) "%s" terméket törölte a felhasználó.', $item->elnevezes),
                'item_id' => $item->id ?? null,
                'item_name' => $item->elnevezes ?? null,
                'user_id' => Auth::id(),
                'user_name' => $this->resolveActorName(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Notification create failed for delete', ['error' => $e->getMessage()]);
        }

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function publicProducts()
    {
        $selectColumns = ['id', 'cikk_szam', 'elnevezes', 'egyseg_ar'];

        if (self::col('kep_url')) {
            $selectColumns[] = 'kep_url';
        }
        if (self::col('kartya_hatterszin')) {
            $selectColumns[] = 'kartya_hatterszin';
        }
        if (self::col('kartya_stilus')) {
            $selectColumns[] = 'kartya_stilus';
        }

        $products = Item::query()
            ->select($selectColumns)
            ->orderBy('elnevezes')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id ?? (int) $item->cikk_szam,
                    'name' => $item->elnevezes,
                    'price' => (float) $item->egyseg_ar,
                    'image' => $item->kep_url,
                    'cardBackground' => $item->kartya_hatterszin,
                    'cardStyle' => $item->kartya_stilus,
                ];
            });

        return response()->json($products);
    }

    // Kiadás: csökkentjük a készletet a megadott mennyiséggel
    public function release(Request $request, $id)
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $item = $this->findItemByIdOrCikk($id);
        if (! $item) {
            return response()->json(['message' => 'A megadott cikkszámú termék nem található.'], Response::HTTP_NOT_FOUND);
        }

        $qty = (int) $data['quantity'];

        try {
            DB::beginTransaction();

            $item->refresh();

            if ($item->akt_keszlet < $qty) {
                DB::rollBack();
                return response()->json(['message' => 'Nincs elegendő készlet a kért mennyiséghez.'], 422);
            }

            $item->akt_keszlet = max(0, $item->akt_keszlet - $qty);
            $item->save();

            // activity log for release
            try {
                Notification::create([
                    'type' => 'release',
                    'message' => sprintf('A(z) "%s" termékből %d darabot levont a felhasználó (ok: %s).', $item->elnevezes, $qty, $data['reason'] ?? ''),
                    'item_id' => $item->id ?? null,
                    'item_name' => $item->elnevezes ?? null,
                    'quantity' => $qty,
                    'user_id' => Auth::id(),
                    'user_name' => $this->resolveActorName(),
                    'reason' => $data['reason'] ?? null,
                    'note' => $data['note'] ?? null,
                ]);
            } catch (\Throwable $e) {
                Log::warning('Notification create failed for release', ['error' => $e->getMessage()]);
            }

            DB::commit();

            return response()->json($item);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Release failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            $message = config('app.debug') ? $e->getMessage() : 'Kiadás során hiba történt.';
            return response()->json(['message' => $message], 500);
        }
    }

    // Raktármozgás: termék raktárhelyének módosítása és értesítés naplózása
    public function move(Request $request, $id)
    {
        $data = $request->validate([
            'from' => ['nullable', 'string', 'max:20'],
            'to' => ['required', 'string', 'max:20'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $item = $this->findItemByIdOrCikk($id);
        if (! $item) {
            return response()->json(['message' => 'A megadott cikkszámú termék nem található.'], Response::HTTP_NOT_FOUND);
        }

        $qty = (int) ($item->akt_keszlet ?? 0);

        $from = $data['from'] ?: ($item->raktarhely ?: $this->inferRackLocationForItem($item));
        $to = trim((string) $data['to']);

        if ($to === $from) {
            return response()->json(['message' => 'A forrás és cél raktárhely nem lehet azonos.'], 422);
        }

        if (self::col('raktarhely')) {
            $item->raktarhely = $to;
            $item->save();
        }

        try {
            Notification::create([
                'type' => 'movement',
                'message' => sprintf('Raktármozgás: "%s" (%d db) %s -> %s.', $item->elnevezes, $qty, $from, $to),
                'item_id' => $item->id ?? null,
                'item_name' => $item->elnevezes ?? null,
                'quantity' => $qty,
                'user_id' => Auth::id(),
                'user_name' => $this->resolveActorName(),
                'reason' => 'Raktármozgás',
                'note' => $data['note'] ?? null,
                'data' => ['from' => $from, 'to' => $to],
            ]);
        } catch (\Throwable $e) {
            Log::warning('Notification create failed for movement', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => 'A raktármozgás sikeresen rögzítve.',
            'item' => $item,
            'movement' => [
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    private function storeOptimizedImage($file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $baseName = 'item_'.Str::uuid();
        $directory = 'items';

        $storeOriginal = function () use ($file, $directory, $baseName, $extension): string {
            $storedPath = $file->storeAs($directory, $baseName.'.'.$extension, 'public');

            if (! $storedPath) {
                Log::error('File storage failed: storeAs returned empty', ['originalName' => $file->getClientOriginalName()]);
                throw new \RuntimeException('Nem sikerült a fájl mentése.');
            }

            // Ellenőrizzük létezését és logoljuk
            try {
                $exists = Storage::disk('public')->exists($storedPath);
            } catch (\Throwable $e) {
                $exists = false;
                Log::warning('Storage::exists hiba', ['error' => $e->getMessage(), 'path' => $storedPath]);
            }

            Log::info('File stored', ['path' => $storedPath, 'exists' => $exists]);

            // Próbáljuk meg a konfigurált URL-t, ha az hibázik fallback a /storage/ útvonalra
            try {
                // Storage::disk('public')->url can fail in some environments; use asset() to build public URL
                $url = asset('storage/' . ltrim($storedPath, '/'));
                if ($url) {
                    return $url;
                }
            } catch (\Throwable $e) {
                Log::warning('Asset URL build sikertelen, fallback alkalmazva', ['error' => $e->getMessage(), 'path' => $storedPath]);
            }

            return url('/storage/' . ltrim($storedPath, '/'));
        };

        try {
            $requiredGdFunctions = [
                'imagecreatefromstring',
                'imagecreatetruecolor',
                'imagecopyresampled',
                'imagewebp',
                'imagesx',
                'imagesy',
                'imagedestroy',
            ];

            foreach ($requiredGdFunctions as $gdFunction) {
                if (! function_exists($gdFunction)) {
                    return $storeOriginal();
                }
            }

            $content = @file_get_contents($file->getRealPath());
            $image = $content ? @\imagecreatefromstring($content) : false;

            // If GD is unavailable or image decode fails, store original safely.
            if (! $image) {
                return $storeOriginal();
            }

            $width = \imagesx($image);
            $height = \imagesy($image);
            $maxSide = 1280;

            if ($width > $maxSide || $height > $maxSide) {
                if ($width >= $height) {
                    $newWidth = $maxSide;
                    $newHeight = (int) round(($height / max(1, $width)) * $newWidth);
                } else {
                    $newHeight = $maxSide;
                    $newWidth = (int) round(($width / max(1, $height)) * $newHeight);
                }

                $resized = \imagecreatetruecolor($newWidth, $newHeight);
                \imagealphablending($resized, false);
                \imagesavealpha($resized, true);
                \imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                \imagedestroy($image);
                $image = $resized;
            }

            $relativePath = $directory.'/'.$baseName.'.webp';
            $absolutePath = Storage::disk('public')->path($relativePath);
            @mkdir(dirname($absolutePath), 0775, true);

            \imagewebp($image, $absolutePath, 78);
            \imagedestroy($image);

            try {
                // Use asset() to build the public URL instead of Storage::url
                $url = asset('storage/' . ltrim($relativePath, '/'));
                if ($url) {
                    return $url;
                }
            } catch (\Throwable $e) {
                Log::warning('Asset URL build sikertelen (webp), fallback alkalmazva', ['error' => $e->getMessage(), 'path' => $relativePath]);
            }

            // Fallback: közvetlen /storage/ útvonal
            $storageFallback = url('/storage/' . ltrim($relativePath, '/'));
            // Logoljuk, ha a fájl fizikailag nem létezik (segít hibakeresésben)
            try {
                $absoluteCheck = Storage::disk('public')->path($relativePath);
                if (! file_exists($absoluteCheck)) {
                    Log::warning('Webp fájl nem található a public disk path-on', ['path' => $absoluteCheck]);
                }
            } catch (\Throwable $e) {
                Log::warning('Fallback ellenőrzés sikertelen', ['error' => $e->getMessage()]);
            }

            return $storageFallback;
        } catch (\Throwable $exception) {
            return $storeOriginal();
        }
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

    private function inferCategoryFromName(?string $name): string
    {
        $value = Str::lower((string) ($name ?? ''));

        if ($value === '') {
            return 'Egyéb';
        }

        if (str_contains($value, 'fonal')) {
            return 'Fonalak';
        }

        if (str_contains($value, 'horgol') || str_contains($value, 'minta')) {
            return 'Horgolóminták';
        }

        if (str_contains($value, 'plüss') || str_contains($value, 'pluss')) {
            return 'Plüssök';
        }

        if (str_contains($value, 'szem') || str_contains($value, 'gomb') || str_contains($value, 'cipz') || str_contains($value, 'kieg')) {
            return 'Kiegészítők';
        }

        if (str_contains($value, 'készlet') || str_contains($value, 'keszlet') || str_contains($value, 'doboz') || str_contains($value, 'horgolotu') || str_contains($value, 'tarto') || str_contains($value, 'kosar') || str_contains($value, 'eszk')) {
            return 'Eszközök';
        }

        return 'Egyéb';
    }

    private function inferRackLocationForItem(Item $item): string
    {
        return $this->inferRackLocationFromValues(
            $item->kategoria ?: $this->inferCategoryFromName($item->elnevezes),
            $item->cikk_szam ?? null,
            $item->elnevezes ?? ''
        );
    }

    private function inferRackLocationFromValues(?string $category, $sku, ?string $name): string
    {
        $rowMap = [
            'Fonalak' => 'R1',
            'Eszközök' => 'R2',
            'Kiegészítők' => 'R3',
            'Plüssök' => 'R4',
            'Horgolóminták' => 'R5',
            'Egyéb' => 'R6',
        ];

        $cat = $category ?: 'Egyéb';
        $row = $rowMap[$cat] ?? 'R6';

        $seed = preg_replace('/\D+/', '', (string) ($sku ?? ''));
        if ($seed === '') {
            $seed = (string) abs(crc32((string) ($name ?? 'item')));
        }

        $num = (int) $seed;
        $col = ($num % 8) + 1;
        $shelf = ((int) floor($num / 8) % 5) + 1;

        return sprintf('%s-O%02d-P%02d', $row, $col, $shelf);
    }

    private function extractPublicStoragePath(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $marker = '/storage/';
        $position = strpos($url, $marker);
        if ($position === false) {
            return null;
        }

        return substr($url, $position + strlen($marker));
    }

    // Segédfüggvény: biztonságosan megkeresi az elemet cikk_szam vagy id alapján (ha id oszlop létezik)
    private function findItemByIdOrCikk($id)
    {
        $query = Item::where('cikk_szam', $id);

        if (is_string($id) && $id !== '') {
            $query->orWhereRaw('LOWER(cikk_szam) = ?', [Str::lower($id)]);
        }

        if (self::col('id')) {
            $query->orWhere('id', $id);
        }
        return $query->first();
    }
}
