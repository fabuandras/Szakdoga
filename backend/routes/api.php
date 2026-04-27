<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'current']);
Route::middleware(['auth:sanctum'])->post('/logout', [UserController::class, 'logout']);

// Ensure /api/login exists and authenticates users, returning a Sanctum token
Route::post('/login', [UserController::class, 'login']);

// API registration (SPA JSON)
Route::post('/register', [UserController::class, 'register']);

// Admin and raktáros routes (protected by sanctum)

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'adminUsers']);
    Route::get('/admin/products', [UserController::class, 'adminProducts']);
    Route::get('/raktar/products', [UserController::class, 'warehouseProducts']);
    Route::post('/admin/users/{felhasznalonev}/block', [UserController::class, 'blockUser']);
    Route::post('/admin/users/{felhasznalonev}/unblock', [UserController::class, 'unblockUser']);
});

// Public webshop products
Route::get('/items', [ItemController::class, 'index'])->withoutMiddleware(['auth:sanctum']);
Route::get('/users', [UserController::class, 'index']);

// Ha még nincs regisztrálva az items erőforrás, regisztráljuk itt
Route::apiResource('items', ItemController::class);

// Release endpoint: csökkenti a termék készletét
Route::post('items/{id}/release', [ItemController::class, 'release']);
Route::post('items/{id}/move', [ItemController::class, 'move']);
Route::get('inventories', [InventoryController::class, 'index']);
Route::post('inventories', [InventoryController::class, 'store']);
Route::get('inventories/{id}', [InventoryController::class, 'show']);
Route::post('inventories/{id}/items/{itemId}', [InventoryController::class, 'saveLine']);
Route::post('inventories/{id}/close', [InventoryController::class, 'close']);
Route::get('notifications', [\App\Http\Controllers\NotificationsController::class, 'index']);

// Webshop kosár és kedvencek
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/shop/cart', [ShopController::class, 'cart']);
    Route::post('/shop/cart/add', [ShopController::class, 'addToCart']);
    Route::patch('/shop/cart/item', [ShopController::class, 'updateCartItem']);
    Route::delete('/shop/cart/item/{itemId}', [ShopController::class, 'removeCartItem']);
    Route::post('/shop/checkout', [ShopController::class, 'checkout']);
    Route::get('/shop/favorites', [ShopController::class, 'favorites']);
    Route::post('/shop/favorites/toggle', [ShopController::class, 'toggleFavorite']);
});

Route::middleware(['auth:sanctum'])->get('/orders', function (Request $request) {
    $user = $request->user();

    $orders = $user->orders()
        ->with(['orderItems.item'])
        ->orderByDesc('kelt')
        ->orderByDesc('rendeles_szam')
        ->get();

    $payload = $orders->map(function ($order) {
        $items = $order->orderItems->map(function ($orderItem) {
            $unitPrice = (float) ($orderItem->item->egyseg_ar ?? 0);
            $quantity = (int) ($orderItem->mennyiseg ?? 0);

            return [
                'item_id' => (int) $orderItem->cikk_szam,
                'name' => $orderItem->item->elnevezes ?? ('Termek #' . $orderItem->cikk_szam),
                'quantity' => $quantity,
                'line_total' => round($unitPrice * $quantity, 2),
            ];
        })->values();

        return [
            'id' => (int) $order->rendeles_szam,
            'createdAt' => optional($order->created_at)->toIso8601String() ?? optional($order->kelt)->toDateString(),
            'totalPrice' => round((float) $items->sum('line_total'), 2),
            'status' => 'Leadva',
            'items' => $items,
        ];
    })->values();

    return response()->json($payload);
});