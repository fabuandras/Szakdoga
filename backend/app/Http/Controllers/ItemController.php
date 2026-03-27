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
use App\Models\Notification;

class ItemController extends Controller
{
    // Lista lekérése
    public function index()
    {
        return response()->json(Item::all());
    }

    // Új tétel létrehozása
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'elnevezes' => ['required', 'string', 'max:50'],
                'akt_keszlet' => ['required', 'integer', 'min:0'],
                'egyseg_ar' => ['required', 'numeric', 'min:0'],
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
                    'user_name' => Auth::user() ? Auth::user()->name : null,
                ]);
            } catch (\Throwable $e) {
                Log::warning('Notification create failed for create', ['error' => $e->getMessage()]);
            }

            return response()->json($item, Response::HTTP_CREATED);
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
            'akt_keszlet' => ['sometimes', 'required', 'integer', 'min:0'],
            'egyseg_ar' => ['sometimes', 'required', 'numeric', 'min:0'],
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

        $item->update($data);

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
                'user_name' => Auth::user() ? Auth::user()->name : null,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Notification create failed for delete', ['error' => $e->getMessage()]);
        }

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function publicProducts()
    {
        $selectColumns = ['id', 'cikk_szam', 'elnevezes', 'egyseg_ar'];

        if (Schema::hasColumn('items', 'kep_url')) {
            $selectColumns[] = 'kep_url';
        }
        if (Schema::hasColumn('items', 'kartya_hatterszin')) {
            $selectColumns[] = 'kartya_hatterszin';
        }
        if (Schema::hasColumn('items', 'kartya_stilus')) {
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
                    'user_name' => Auth::user() ? Auth::user()->name : null,
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
        if (Schema::hasColumn('items', 'id')) {
            $query->orWhere('id', $id);
        }
        return $query->first();
    }
}
