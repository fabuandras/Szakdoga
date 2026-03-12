<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

// Public product endpoints
Route::get('/products', [ItemController::class, 'publicProducts']);
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

// Login: safe closure that returns a token
Route::post('/login', function (Request $request) {
    $data = $request->only(['email', 'password']);

    if (empty($data['email']) || empty($data['password'])) {
        return response()->json(['message' => 'Email and password required'], 422);
    }

    // attempt to find user by email or username/name
    $user = User::where('email', $data['email'])
        ->orWhere('name', $data['email'])
        ->orWhere('felhasznalonev', $data['email'] ?? null)
        ->first();

    if (! $user || ! Hash::check($data['password'], $user->password)) {
        return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
    }

    // create token
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ], 200);
});

// Public user endpoints
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{username}', [UserController::class, 'show']);

// Authenticated user info
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
