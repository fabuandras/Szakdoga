<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Fallback API login for JSON requests
Route::post('/api/login', function (Request $request) {
    $data = $request->json()->all() ?: $request->all();
    $login = $data['email'] ?? $data['login'] ?? null;
    $password = $data['password'] ?? null;

    if (! $login || ! $password) {
        return response()->json(['message' => 'Missing credentials'], 422);
    }

    $query = User::query();
    if (Schema::hasColumn('users', 'email')) {
        $query->where('email', $login);
    }
    if (Schema::hasColumn('users', 'name')) {
        $query->orWhere('name', $login);
    }
    if (Schema::hasColumn('users', 'username')) {
        $query->orWhere('username', $login);
    }
    if (Schema::hasColumn('users', 'felhasznalonev')) {
        $query->orWhere('felhasznalonev', $login);
    }

    $user = $query->first();

    $passwordColumn = Schema::hasColumn('users', 'password') ? 'password' : (Schema::hasColumn('users', 'jelszo') ? 'jelszo' : null);

    if (! $user || ! $passwordColumn || ! Hash::check($password, $user->{$passwordColumn})) {
        return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
    }

    // login the user (session)
    Auth::login($user);
    $request->session()->regenerate();

    // create token if possible
    $token = null;
    try {
        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('api-token')->plainTextToken;
        }
    } catch (\Throwable $e) {
        // ignore
    }

    return response()->json(['user' => $user, 'token' => $token], 200);
});

// Fallback API register that forwards to the controller
Route::post('/api/register', function (Request $request) {
    $controller = new RegisteredUserController();
    return $controller->store($request);
});

require __DIR__.'/auth.php';
