<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

Route::get('/products', [ItemController::class, 'publicProducts']);
Route::post('/login', [AuthenticatedSessionController::class, 'apiStore']);

// Public user endpoints for frontend
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{username}', [UserController::class, 'show']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

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
});
