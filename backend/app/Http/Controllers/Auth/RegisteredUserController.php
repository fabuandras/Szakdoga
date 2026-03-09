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
            'felhasznalonev' => ['required', 'string', 'max:30', 'unique:users,felhasznalonev'],
            'vez_nev' => ['required', 'string', 'max:20'],
            'ker_nev' => ['required', 'string', 'max:20'],
            'megszolitas' => ['required', 'string', 'max:10'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:40', 'unique:'.User::class],
            'tel_szam' => ['required', 'string', 'max:20'],
            'szul_datum' => ['required', 'date', 'before_or_equal:today'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'felhasznalonev' => $request->string('felhasznalonev')->toString(),
            'vez_nev' => $request->string('vez_nev')->toString(),
            'ker_nev' => $request->string('ker_nev')->toString(),
            'megszolitas' => $request->string('megszolitas')->toString(),
            'email' => $request->email,
            'tel_szam' => $request->string('tel_szam')->toString(),
            'szul_datum' => $request->input('szul_datum'),
            'jelszo' => Hash::make((string) $request->input('password')),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
