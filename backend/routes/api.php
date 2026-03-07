<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->post('/logout', function (Request $request) {
    $user = $request->user();

    if ($user && method_exists($user, 'currentAccessToken')) {
        $token = $user->currentAccessToken();
        if ($token) {
            $token->delete();
        }
    }

    if (Auth::guard('web')->check()) {
        Auth::guard('web')->logout();
    }

    if ($request->hasSession()) {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    return response()->json(['message' => 'Logged out']);
})->withoutMiddleware([ValidateCsrfToken::class]);
