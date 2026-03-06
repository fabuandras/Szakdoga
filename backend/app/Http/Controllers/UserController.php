<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $messages = [
            'felhasznalonev.required' => 'A felhasználónév megadása kötelező.',
            'felhasznalonev.unique' => 'A felhasználónév már foglalt.',
            'vez_nev.required' => 'A vezetéknév megadása kötelező.',
            'ker_nev.required' => 'A keresztnév megadása kötelező.',
            'email.required' => 'Az email megadása kötelező.',
            'email.email' => 'Érvénytelen email formátum.',
            'email.unique' => 'Az email cím már foglalt.',
            'password.required' => 'A jelszó megadása kötelező.',
            'password.confirmed' => 'A jelszó megerősítése nem egyezik.',
            'password.min' => 'A jelszónak legalább :min karakter hosszúnak kell lennie.',
        ];
//test 2
        $data = $request->validate([
            'felhasznalonev' => 'required|string|max:255|unique:users,felhasznalonev',
            'vez_nev' => 'required|string|max:255',
            'ker_nev' => 'required|string|max:255',
            'megszolitas' => 'nullable|string|max:50',
            'tel_szam' => 'nullable|string|max:50',
            'szul_datum' => 'nullable|date',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ], $messages);

        $user = User::create([
            'felhasznalonev' => $data['felhasznalonev'],
            'vez_nev' => $data['vez_nev'],
            'ker_nev' => $data['ker_nev'],
            'megszolitas' => $data['megszolitas'] ?? null,
            'tel_szam' => $data['tel_szam'] ?? null,
            'szul_datum' => $data['szul_datum'] ?? null,
            'email' => $data['email'],
            'jelszo' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $messages = [
            'email_or_username.required' => 'A felhasználónév vagy email megadása kötelező.',
            'password.required' => 'A jelszó megadása kötelező.',
        ];

        $data = $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ], $messages);

        $login = $data['email_or_username'];

        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $login)->first();
        } else {
            $user = User::where('felhasznalonev', $login)->first();
        }

        if (! $user || ! Hash::check($data['password'], $user->jelszo)) {
            return response()->json(['message' => 'Hibás felhasználónév/email vagy jelszó.'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    // Modified index method to avoid selecting non-existent 'id' column
    public function index(Request $request)
    {
        // Select columns that exist in the users table (avoid 'id' if it's missing)
        $rows = DB::table('users')->select(
            'felhasznalonev',
            'vez_nev',
            'ker_nev',
            'megszolitas',
            'tel_szam',
            'szul_datum',
            'email',
            'created_at',
            'updated_at'
        )->get();

        // Map to include an 'id' field for frontend keys (use felhasznalonev as unique id)
        $users = $rows->map(function ($r) {
            return [
                'id' => $r->felhasznalonev,
                'felhasznalonev' => $r->felhasznalonev,
                'vez_nev' => $r->vez_nev,
                'ker_nev' => $r->ker_nev,
                'megszolitas' => $r->megszolitas,
                'tel_szam' => $r->tel_szam,
                'szul_datum' => $r->szul_datum,
                'email' => $r->email,
                'created_at' => $r->created_at,
                'updated_at' => $r->updated_at,
            ];
        });

        return response()->json(['users' => $users]);
    }
//test
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out']);
    }
}