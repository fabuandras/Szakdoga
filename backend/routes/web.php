<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Fallback logout route for POST /api/logout (handles token and session logout)
Route::post('/api/logout', function (Request $request) {
    $user = $request->user() ?? Auth::user();

    if ($user) {
        try {
            if (method_exists($user, 'currentAccessToken') && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }
        } catch (\Throwable $e) {
            // ignore
        }

        try {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        } catch (\Throwable $e) {
            // ignore
        }

        return response()->json(null, 204);
    }

    // try delete by bearer token if provided
    $token = $request->bearerToken();
    if ($token) {
        try {
            $pat = PersonalAccessToken::findToken($token);
            if ($pat) { $pat->delete(); }
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            // ignore
        }
    }

    return response()->json(['message' => 'Not authenticated'], 401);
});

require __DIR__.'/auth.php';
