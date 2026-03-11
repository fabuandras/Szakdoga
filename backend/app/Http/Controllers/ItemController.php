<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(Item::all());
    }

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
                        if (is_string($value) && str_starts_with($value, 'data:image/')) {
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

            $item = Item::create($data);

            return response()->json($item, 201);
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

    public function show($id)
    {
        $item = Item::findOrFail($id);

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $data = $request->validate([
            'elnevezes' => ['sometimes', 'required', 'string', 'max:50'],
            'akt_keszlet' => ['sometimes', 'required', 'integer', 'min:0'],
            'egyseg_ar' => ['sometimes', 'required', 'numeric', 'min:0'],
            'kep_url' => [
                'nullable',
                'string',
                'max:10000',
                function ($attribute, $value, $fail) {
                    if (is_string($value) && str_starts_with($value, 'data:image/')) {
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

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        $oldPath = $this->extractPublicStoragePath($item->kep_url);
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function publicProducts()
    {
        $selectColumns = ['cikk_szam', 'elnevezes', 'egyseg_ar'];

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
            ->orderBy('cikk_szam')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (int) $item->cikk_szam,
                    'name' => $item->elnevezes,
                    'price' => (float) $item->egyseg_ar,
                    'image' => $item->kep_url,
                    'cardBackground' => $item->kartya_hatterszin,
                    'cardStyle' => $item->kartya_stilus,
                ];
            });

        return response()->json($products);
    }

    private function storeOptimizedImage($file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $baseName = 'item_'.Str::uuid();
        $directory = 'items';

        $storeOriginal = function () use ($file, $directory, $baseName, $extension): string {
            $storedPath = $file->storeAs($directory, $baseName.'.'.$extension, 'public');

            return Storage::disk('public')->url($storedPath);
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

            return Storage::disk('public')->url($relativePath);
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
}
