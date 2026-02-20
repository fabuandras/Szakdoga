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

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'vez_nev' => ['required', 'string', 'max:20'],
            'ker_nev' => ['required', 'string', 'max:20'],
            'megszolitas' => ['required', 'string', 'max:10'],
            'email' => ['required', 'string', 'email', 'max:40', 'unique:users,email'],
            'tel_szam' => ['required', 'string', 'max:20'],
            'szul_datum' => ['required', 'date'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'vez_nev'      => $request->vez_nev,
            'ker_nev'      => $request->ker_nev,
            'megszolitas'  => $request->megszolitas,
            'email'        => $request->email,
            'tel_szam'     => $request->tel_szam,
            'szul_datum'   => $request->szul_datum,
            'jelszo'       => Hash::make($request->password ?? $request->jelszo),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
