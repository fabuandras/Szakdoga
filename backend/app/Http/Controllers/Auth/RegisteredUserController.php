<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'vez_nev' => 'required|string|max:255',
            'ker_nev' => 'required|string|max:255',
            'felhasznalonev' => 'required|string|max:255|unique:users,felhasznalonev',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|confirmed|min:8',
            'megszolitas' => 'required|string|max:10',
            'tel_szam' => 'required|string|max:20',
            'szul_datum' => 'required|date',
        ]);

        $user = User::create([
            'vez_nev' => $request->vez_nev,
            'ker_nev' => $request->ker_nev,
            'felhasznalonev' => $request->felhasznalonev,
            'email' => $request->email,
            'jelszo' => Hash::make($request->password),
            'megszolitas' => $request->megszolitas,
            'tel_szam' => $request->tel_szam,
            'szul_datum' => $request->szul_datum,
            'kedvencek' => [],
            'kosar' => [],
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
