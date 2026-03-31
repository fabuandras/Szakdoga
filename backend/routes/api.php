<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->post('/logout', function (Request $request) {
    $user = $request->user();

    $currentToken = $user && method_exists($user, 'currentAccessToken')
        ? $user->currentAccessToken()
        : null;

    // Cookie/stateful auth may return a TransientToken that does not support delete().
    if ($currentToken && method_exists($currentToken, 'delete')) {
        $currentToken->delete();
    }

    if ($request->hasSession()) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    return response()->json(['message' => 'Sikeres kijelentkezes.'], 200);
});

// Ensure /api/login exists and authenticates users, returning a Sanctum token
Route::post('/login', function (Request $request) {
    $data = $request->only(['email', 'password']);

    if (empty($data['email']) || empty($data['password'])) {
        return response()->json(['message' => 'Email and password required'], 422);
    }

    // Users table columns: email (unique), felhasznalonev (username, unique), jelszo (password)
    $user = User::where('email', $data['email'])
                ->orWhere('felhasznalonev', $data['email'])
                ->first();

    if (! $user || ! Hash::check($data['password'], $user->jelszo)) {
        return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
    }

    // determine role from email
    $email = $user->email ?? '';
    $role = 'webshop';
    if (str_contains($email, '@admin')) {
        $role = 'admin';
    } elseif (str_contains($email, '@raktaros')) {
        $role = 'raktaros';
    }

    // create token with role as ability (optional)
    $token = $user->createToken('api-token', [$role])->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
        'role' => $role,
    ], 200);
});

// API registration (SPA JSON)
Route::post('/register', [RegisteredUserController::class, 'store']);

// Admin and raktáros routes (protected by sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
	// Admin: list users
	Route::get('/admin/users', function (Request $request) {
		$user = $request->user();
		$email = $user->email ?? '';
		if (! $user || (function_exists('str_contains') ? !str_contains($email, '@admin') : strpos($email, '@admin') === false)) {
			return response()->json(['message' => 'Forbidden'], 403);
		}
		return response()->json(User::all(), 200);
	});

	// Admin: list all products
	Route::get('/admin/products', function (Request $request) {
		$user = $request->user();
		$email = $user->email ?? '';
		if (! $user || (function_exists('str_contains') ? !str_contains($email, '@admin') : strpos($email, '@admin') === false)) {
			return response()->json(['message' => 'Forbidden'], 403);
		}
		return response()->json(Item::all(), 200);
	});

	// Raktáros: list products for warehouse management
	Route::get('/raktar/products', function (Request $request) {
		$user = $request->user();
		$email = $user->email ?? '';
		if (! $user || (function_exists('str_contains') ? !str_contains($email, '@raktaros') : strpos($email, '@raktaros') === false)) {
			return response()->json(['message' => 'Forbidden'], 403);
		}
		return response()->json(Item::all(), 200);
	});
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
