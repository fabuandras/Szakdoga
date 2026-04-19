<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        // Normalize birthdate: convert empty string to null and format valid dates to Y-m-d
        $szul_datum = null;
        if (isset($data['szul_datum']) && $data['szul_datum'] !== '') {
            try {
                $szul_datum = Carbon::parse($data['szul_datum'])->format('Y-m-d');
            } catch (\Exception $e) {
                $szul_datum = null;
            }
        }

        $user = User::create([
            'felhasznalonev' => $data['felhasznalonev'],
            'vez_nev' => $data['vez_nev'],
            'ker_nev' => $data['ker_nev'],
            'megszolitas' => $data['megszolitas'] ?? null,
            'tel_szam' => $data['tel_szam'] ?? null,
            'szul_datum' => $szul_datum,
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
            'email.required' => 'Az email megadása kötelező.',
            'password.required' => 'A jelszó megadása kötelező.',
        ];

        $data = $request->validate([
            'email_or_username' => 'sometimes|string|nullable',
            'email' => 'sometimes|string|nullable',
            'password' => 'required|string',
        ], $messages);

        $login = $data['email_or_username'] ?? $data['email'] ?? null;
        if (! $login) {
            return response()->json(['message' => 'A felhasználónév vagy email megadása kötelező.'], 422);
        }

        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $login)->first();
        } else {
            $user = User::where('felhasznalonev', $login)->first();
        }

        if (! $user || ! Hash::check($data['password'], $user->jelszo)) {
            return response()->json(['message' => 'Hibás felhasználónév/email vagy jelszó.'], 401);
        }

        // Ellenőrizze, hogy a felhasználó blokkolva van-e
        if ($user->is_blocked) {
            return response()->json(['message' => 'A fiókját letiltottuk. Kérjük vegye fel a kapcsolatot!'], 403);
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
            'is_blocked',
            'blocked_reason',
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
                'is_blocked' => $r->is_blocked,
                'blocked_reason' => $r->blocked_reason,
                'created_at' => $r->created_at,
                'updated_at' => $r->updated_at,
            ];
        });

        return response()->json(['users' => $users]);
    }

    // Return single user by username (felhasznalonev)
    public function show($username)
    {
        $r = DB::table('users')->select(
            'felhasznalonev',
            'vez_nev',
            'ker_nev',
            'megszolitas',
            'tel_szam',
            'szul_datum',
            'email',
            'created_at',
            'updated_at'
        )->where('felhasznalonev', $username)->first();

        if (! $r) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user = [
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

        return response()->json(['user' => $user]);
    }

    public function current(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($user->makeHidden(['jelszo', 'remember_token']));
    }

    public function adminUsers(Request $request)
    {
        if (! $this->hasRole($request, 'admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(User::all(), 200);
    }

    public function adminProducts(Request $request)
    {
        if (! $this->hasRole($request, 'admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(Item::all(), 200);
    }

    public function warehouseProducts(Request $request)
    {
        if (! $this->hasRole($request, 'raktaros')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(Item::all(), 200);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()?->delete();
        }

        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Logged out']);
    }

    // Felhasználó blokkolása
    public function blockUser(Request $request, $felhasznalonev)
    {
        if (! $this->hasRole($request, 'admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::where('felhasznalonev', $felhasznalonev)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->is_blocked = true;
        $user->blocked_reason = 'A fiókját az adminisztrátor letiltotta.';
        $user->save();

        return response()->json(['message' => 'User blocked successfully', 'user' => $user], 200);
    }

    // Felhasználó feloldása
    public function unblockUser(Request $request, $felhasznalonev)
    {
        if (! $this->hasRole($request, 'admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::where('felhasznalonev', $felhasznalonev)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->is_blocked = false;
        $user->blocked_reason = null;
        $user->save();

        return response()->json(['message' => 'User unblocked successfully', 'user' => $user], 200);
    }

    private function hasRole(Request $request, string $role): bool
    {
        $email = $request->user()->email ?? '';
        return str_contains($email, "@{$role}");
    }
}