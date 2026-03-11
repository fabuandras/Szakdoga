<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ItemController::class, 'publicProducts']);
Route::post('/login', [AuthenticatedSessionController::class, 'apiStore']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('items', ItemController::class);

    Route::get('/shop/favorites', [ShopController::class, 'favorites']);
    Route::post('/shop/favorites/toggle', [ShopController::class, 'toggleFavorite']);

    Route::get('/shop/cart', [ShopController::class, 'cart']);
    Route::post('/shop/cart/add', [ShopController::class, 'addToCart']);
    Route::patch('/shop/cart/item', [ShopController::class, 'updateCartItem']);
    Route::delete('/shop/cart/item/{itemId}', [ShopController::class, 'removeCartItem']);

    Route::post('/logout', [ShopController::class, 'logout']);
});
