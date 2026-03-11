<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function favorites(Request $request): JsonResponse
    {
        $user = $request->user();
        $favoriteIds = collect($user->kedvencek ?? [])->map(fn ($id) => (int) $id)->values();

        if ($favoriteIds->isEmpty()) {
            return response()->json([]);
        }

        $items = Item::whereIn('cikk_szam', $favoriteIds)->get();

        return response()->json($items);
    }

    public function toggleFavorite(Request $request): JsonResponse
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer', 'exists:items,cikk_szam'],
        ]);

        $user = $request->user();
        $favorites = collect($user->kedvencek ?? [])->map(fn ($id) => (int) $id)->values();
        $itemId = (int) $data['item_id'];

        if ($favorites->contains($itemId)) {
            $favorites = $favorites->reject(fn ($id) => $id === $itemId)->values();
        } else {
            $favorites->push($itemId);
        }

        $user->kedvencek = $favorites->values()->all();
        $user->save();

        return response()->json([
            'favorites' => $user->kedvencek,
        ]);
    }

    public function cart(Request $request): JsonResponse
    {
        return response()->json($this->buildCartPayload($request->user()));
    }

    public function addToCart(Request $request): JsonResponse
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer', 'exists:items,cikk_szam'],
            'qty' => ['nullable', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $qty = (int) ($data['qty'] ?? 1);
        $itemId = (int) $data['item_id'];

        $cart = collect($user->kosar ?? [])->map(function ($row) {
            return [
                'item_id' => (int) ($row['item_id'] ?? 0),
                'qty' => (int) ($row['qty'] ?? 0),
            ];
        })->values();

        $rowIndex = $cart->search(fn ($row) => $row['item_id'] === $itemId);

        if ($rowIndex === false) {
            $cart->push([
                'item_id' => $itemId,
                'qty' => $qty,
            ]);
        } else {
            $existing = $cart->get($rowIndex);
            $existing['qty'] += $qty;
            $cart->put($rowIndex, $existing);
        }

        $user->kosar = $cart->values()->all();
        $user->save();

        return response()->json($this->buildCartPayload($user));
    }

    public function updateCartItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer', 'exists:items,cikk_szam'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $itemId = (int) $data['item_id'];
        $newQty = (int) $data['qty'];

        $cart = collect($user->kosar ?? [])->map(function ($row) {
            return [
                'item_id' => (int) ($row['item_id'] ?? 0),
                'qty' => (int) ($row['qty'] ?? 0),
            ];
        })->values();

        $rowIndex = $cart->search(fn ($row) => $row['item_id'] === $itemId);
        if ($rowIndex === false) {
            return response()->json(['message' => 'A termek nem talalhato a kosarban.'], 404);
        }

        $cart->put($rowIndex, [
            'item_id' => $itemId,
            'qty' => $newQty,
        ]);

        $user->kosar = $cart->values()->all();
        $user->save();

        return response()->json($this->buildCartPayload($user));
    }

    public function removeCartItem(Request $request, int $itemId): JsonResponse
    {
        $user = $request->user();
        $normalizedId = (int) $itemId;

        $cart = collect($user->kosar ?? [])->map(function ($row) {
            return [
                'item_id' => (int) ($row['item_id'] ?? 0),
                'qty' => (int) ($row['qty'] ?? 0),
            ];
        })->reject(fn ($row) => $row['item_id'] === $normalizedId)->values();

        $user->kosar = $cart->all();
        $user->save();

        return response()->json($this->buildCartPayload($user));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        auth()->guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sikeres kijelentkezes.']);
    }

    private function buildCartPayload($user): array
    {
        $cartRows = collect($user->kosar ?? [])->map(function ($row) {
            return [
                'item_id' => (int) ($row['item_id'] ?? 0),
                'qty' => max(1, (int) ($row['qty'] ?? 1)),
            ];
        })->filter(fn ($row) => $row['item_id'] > 0)->values();

        if ($cartRows->isEmpty()) {
            return [
                'items' => [],
                'total' => 0,
            ];
        }

        $itemIds = $cartRows->pluck('item_id')->unique()->values();
        $itemsById = Item::whereIn('cikk_szam', $itemIds)->get()->keyBy('cikk_szam');

        $rows = $cartRows->map(function ($row) use ($itemsById) {
            $item = $itemsById->get($row['item_id']);
            if (! $item) {
                return null;
            }

            $qty = (int) $row['qty'];
            $lineTotal = (float) $item->egyseg_ar * $qty;

            return [
                'item_id' => (int) $item->cikk_szam,
                'elnevezes' => $item->elnevezes,
                'kep_url' => $item->kep_url,
                'egyseg_ar' => (float) $item->egyseg_ar,
                'qty' => $qty,
                'line_total' => round($lineTotal, 2),
            ];
        })->filter()->values();

        return [
            'items' => $rows,
            'total' => round((float) $rows->sum('line_total'), 2),
        ];
    }
}
