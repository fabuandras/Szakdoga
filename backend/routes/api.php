<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use App\Models\Item;

Route::get('/products', [ItemController::class, 'publicProducts']);
Route::post('/login', [AuthenticatedSessionController::class, 'apiStore']);

// Public user endpoints for frontend
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{username}', [UserController::class, 'show']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

<<<<<<< HEAD
Route::get('/items', function (Request $request) {
    try {
        if (! class_exists(Item::class) || ! Schema::hasTable('items')) {
            return response()->json([], 200);
        }
        return response()->json(Item::all());
    } catch (\Throwable $e) {
        return response()->json([], 200);
    }
});

Route::get('/items-public', function (Request $request) {
    try {
        if (! class_exists(Item::class) || ! Schema::hasTable('items')) {
            return response()->json([], 200);
        }
        if (Schema::hasColumn('items', 'public')) {
            return response()->json(Item::where('public', 1)->get());
        }
        return response()->json(Item::all());
    } catch (\Throwable $e) {
        return response()->json([], 200);
    }
=======
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('items', ItemController::class);

    Route::get('/shop/favorites', [ShopController::class, 'favorites']);
    Route::post('/shop/favorites/toggle', [ShopController::class, 'toggleFavorite']);

    Route::get('/shop/cart', [ShopController::class, 'cart']);
    Route::post('/shop/cart/add', [ShopController::class, 'addToCart']);
    Route::patch('/shop/cart/item', [ShopController::class, 'updateCartItem']);
    Route::delete('/shop/cart/item/{itemId}', [ShopController::class, 'removeCartItem']);

    Route::post('/logout', [ShopController::class, 'logout']);
>>>>>>> 49aed2ab478fd4da1a1aa8d4ee66ba328d949725
});
