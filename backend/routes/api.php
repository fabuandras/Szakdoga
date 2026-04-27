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

// Change password endpoint for frontend Profile page
Route::post('/user/change-password', function (Request $request) {
    $user = $request->user();
    if (! $user) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    $data = $request->validate([
        'currentPassword' => 'required|string',
        'newPassword' => 'required|string|min:8',
    ]);

    try {
        if (!\Illuminate\Support\Facades\Hash::check($data['currentPassword'], $user->password)) {
            return response()->json(['message' => 'A jelenlegi jelszó nem megfelelő.'], 422);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($data['newPassword']);
        $user->save();

        return response()->json(['message' => 'A jelszó sikeresen módosítva.']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Hiba történt a jelszó módosítása során.'], 500);
    }
});

// Fallback sample orders for frontend Profile page during development
Route::get('/orders', function (Request $request) {
    // If an authenticated user has orders relationship, try to return them
    $user = $request->user();
    if ($user && method_exists($user, 'orders')) {
        try {
            return response()->json($user->orders()->with('items')->get());
        } catch (\Exception $e) {
            // fall through to sample data
        }
    }

    $sample = [
        [
            'id' => 1001,
            'createdAt' => date('c'),
            'totalPrice' => 7990,
            'status' => 'Teljesítve',
            'items' => [
                [ 'name' => 'Amigurumi Starter Kit', 'quantity' => 1 ],
            ],
        ],
        [
            'id' => 1002,
            'createdAt' => date('c'),
            'totalPrice' => 1190,
            'status' => 'Feldolgozás alatt',
            'items' => [
                [ 'name' => 'Bambusz Horgolotu 5mm', 'quantity' => 2 ],
            ],
        ],
    ];

    return response()->json($sample);
});