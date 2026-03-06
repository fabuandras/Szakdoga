<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication
Route::post('/register', [UserController::class, 'register']);
Route::post('/login',    [UserController::class, 'login']);

// Public item endpoints
Route::get('/items',       [ItemController::class, 'index']);
Route::get('/items/{id}',  [ItemController::class, 'show']);

// Protected endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);

    // Items CRUD (protected)
    Route::post('/items',        [ItemController::class, 'store']);
    Route::put('/items/{id}',    [ItemController::class, 'update']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);

    // Orders
    Route::get('/orders',        [OrderController::class, 'index']);
    Route::get('/orders/{id}',   [OrderController::class, 'show']);
    Route::post('/orders',       [OrderController::class, 'store']);

    // Payments
    Route::post('/payments',     [PaymentController::class, 'process']);
});
