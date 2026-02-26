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
            'felhasznalonev' => ['required', 'string', 'max:255', 'unique:users,felhasznalonev'],
            'vez_nev' => ['required', 'string', 'max:255'],
            'ker_nev' => ['required', 'string', 'max:255'],
            'megszolitas' => ['nullable', 'string', 'max:50'],
            'tel_szam' => ['nullable', 'string', 'max:50'],
            'szul_datum' => ['nullable', 'date'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'felhasznalonev' => $request->input('felhasznalonev'),
            'vez_nev' => $request->input('vez_nev'),
            'ker_nev' => $request->input('ker_nev'),
            'megszolitas' => $request->input('megszolitas'),
            'tel_szam' => $request->input('tel_szam'),
            'szul_datum' => $request->input('szul_datum'),
            'email' => $request->input('email'),
            'jelszo' => Hash::make($request->input('password')),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
