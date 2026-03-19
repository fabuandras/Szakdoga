<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Ensure /api/login exists and authenticates users, returning a Sanctum token
Route::post('/login', function (Request $request) {
    $data = $request->only(['email', 'password']);

    if (empty($data['email']) || empty($data['password'])) {
        return response()->json(['message' => 'Email and password required'], 422);
    }

    // build query using only columns that exist to avoid SQL errors
    $query = User::query();
    $query->where('email', $data['email']);

    if (Schema::hasColumn('users', 'name')) {
        $query->orWhere('name', $data['email']);
    }
    if (Schema::hasColumn('users', 'username')) {
        $query->orWhere('username', $data['email']);
    }
    if (Schema::hasColumn('users', 'felhasznalonev')) {
        $query->orWhere('felhasznalonev', $data['email']);
    }

    $user = $query->first();

    // determine password column
    $passwordColumn = Schema::hasColumn('users', 'password') ? 'password' : (Schema::hasColumn('users', 'jelszo') ? 'jelszo' : null);

    if (! $user || ! $passwordColumn || ! Hash::check($data['password'], $user->{$passwordColumn})) {
        return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
    }

    // create token
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ], 200);
});

// API registration (SPA JSON)
Route::post('/register', [RegisteredUserController::class, 'store']);
