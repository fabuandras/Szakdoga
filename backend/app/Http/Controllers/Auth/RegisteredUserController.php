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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $input = $request->all();
        $columns = (new User())->getFillable();
        $data = [];

        // Explicit whitelist mapping: map frontend fields to DB columns (choose first available column)
        $whitelist = [
            'felhasznalonev' => ['felhasznalonev','name','username'],
            'vez_nev' => ['vez_nev','vezeteknev','vezetek_nev','last_name'],
            'ker_nev' => ['ker_nev','keresztnev','kereszt_nev','first_name'],
            'megszolitas' => ['megszolitas','title'],
            'telefonszam' => ['tel_szam','telefonszam','phone','telefon'],
            'szul_datum' => ['szul_datum','birthdate','szul_datum'],
        ];

        foreach ($whitelist as $inputKey => $possibleCols) {
            if (! isset($input[$inputKey])) continue;
            foreach ($possibleCols as $col) {
                if (in_array($col, $columns)) {
                    // handle date normalization for birthdate-like fields
                    if ($inputKey === 'szul_datum') {
                        $raw = trim($input[$inputKey]);
                        try {
                            if (preg_match_all('/\d+/', $raw, $m) && ! empty($m[0])) {
                                $nums = $m[0];
                                if (strlen($nums[0]) === 4 && count($nums) >= 3) {
                                    $Y = $nums[0]; $M = str_pad($nums[1],2,'0',STR_PAD_LEFT); $D = str_pad($nums[2],2,'0',STR_PAD_LEFT);
                                } elseif (count($nums) >= 3) {
                                    $D = str_pad($nums[0],2,'0',STR_PAD_LEFT); $M = str_pad($nums[1],2,'0',STR_PAD_LEFT); $Y = $nums[2]; if (strlen($Y)===2) $Y='20'.$Y;
                                } else {
                                    $dt = Carbon::parse($raw);
                                    $data[$col] = $dt->format('Y-m-d');
                                    break;
                                }
                                $data[$col] = "$Y-$M-$D";
                            } else {
                                $dt = Carbon::parse($raw);
                                $data[$col] = $dt->format('Y-m-d');
                            }
                        } catch (\Throwable $e) {
                            // if parsing fails, skip setting this field
                        }
                    } else {
                        $data[$col] = $input[$inputKey];
                    }
                    break;
                }
            }
        }

        // Copy a small set of additional safe fields if they match columns
        $safeFields = ['email'];
        foreach ($safeFields as $f) {
            if (isset($input[$f]) && in_array($f, $columns)) {
                $data[$f] = $input[$f];
            }
        }

        // További biztonsági ellenőrzés: ha a felhasznalonev oszlop létezik és még nincs beállítva, generáljunk egyet
        if (in_array('felhasznalonev', $columns) && empty($data['felhasznalonev'])) {
            if (! empty($input['felhasznalonev'])) {
                $data['felhasznalonev'] = $input['felhasznalonev'];
            } elseif (! empty($input['email'])) {
                $data['felhasznalonev'] = strstr($input['email'], '@', true) ?: ('user' . time());
            } elseif (! empty($input['vez_nev']) || ! empty($input['ker_nev'])) {
                $data['felhasznalonev'] = trim(($input['vez_nev'] ?? '') . ' ' . ($input['ker_nev'] ?? '')) ?: ('user' . time());
            } else {
                $data['felhasznalonev'] = 'user' . time();
            }
        }

        // Ensure critical required columns exist in $data with sensible values
        $requiredCols = ['felhasznalonev','vez_nev','ker_nev','tel_szam','szul_datum','email'];
        foreach ($requiredCols as $col) {
            if (! in_array($col, $columns)) continue;
            if (isset($data[$col]) && $data[$col] !== null && $data[$col] !== '') continue;

            // attempt to populate from input using multiple possible keys
            $found = false;
            $candidates = [];
            switch ($col) {
                case 'felhasznalonev':
                    $candidates = ['felhasznalonev','username','name'];
                    break;
                case 'vez_nev':
                    $candidates = ['vez_nev','vezeteknev','vezetek_nev','last_name','vezetekNev'];
                    break;
                case 'ker_nev':
                    $candidates = ['ker_nev','keresztnev','kereszt_nev','first_name','keresztNev'];
                    break;
                case 'tel_szam':
                    $candidates = ['tel_szam','telefonszam','telefon','phone'];
                    break;
                case 'szul_datum':
                    $candidates = ['szul_datum','birthdate','szul_datum','birth_date'];
                    break;
                case 'email':
                    $candidates = ['email'];
                    break;
            }

            foreach ($candidates as $k) {
                if (! empty($input[$k])) {
                    // normalize birthday if needed
                    if ($col === 'szul_datum') {
                        try {
                            if (preg_match_all('/\d+/', trim($input[$k]), $m) && ! empty($m[0])) {
                                $nums = $m[0];
                                if (strlen($nums[0]) === 4 && count($nums) >= 3) {
                                    $Y = $nums[0]; $M = str_pad($nums[1],2,'0',STR_PAD_LEFT); $D = str_pad($nums[2],2,'0',STR_PAD_LEFT);
                                } elseif (count($nums) >= 3) {
                                    $D = str_pad($nums[0],2,'0',STR_PAD_LEFT); $M = str_pad($nums[1],2,'0',STR_PAD_LEFT); $Y = $nums[2]; if (strlen($Y)===2) $Y='20'.$Y;
                                } else {
                                    $dt = Carbon::parse($input[$k]);
                                    $data[$col] = $dt->format('Y-m-d');
                                    $found = true; break;
                                }
                                $data[$col] = "$Y-$M-$D";
                                $found = true; break;
                            } else {
                                $dt = Carbon::parse($input[$k]);
                                $data[$col] = $dt->format('Y-m-d');
                                $found = true; break;
                            }
                        } catch (\Throwable $e) {
                            // ignore and continue
                        }
                    } else {
                        $data[$col] = $input[$k];
                        $found = true; break;
                    }
                }
            }

            if (! $found) {
                // fallbacks
                if ($col === 'felhasznalonev') {
                    if (! empty($input['email'])) $data[$col] = strstr($input['email'], '@', true) ?: 'user'.time(); else $data[$col] = 'user'.time();
                } elseif ($col === 'email') {
                    $data[$col] = $input['email'] ?? ('user'.time().'@example.com');
                } elseif ($col === 'szul_datum') {
                    $data[$col] = now()->format('Y-m-d');
                } else {
                    $data[$col] = '';
                }
            }
        }

        // Ensure password column exists
        if (in_array('password', $columns) && empty($data['password'])) {
            $data['password'] = Hash::make($input['password'] ?? 'password');
        } elseif (in_array('jelszo', $columns) && empty($data['jelszo'])) {
            $data['jelszo'] = Hash::make($input['password'] ?? 'password');
        }

        // create user via property assignment to avoid fillable/mass-assignment issues
        $user = new User();
        foreach ($data as $k => $v) {
            $user->{$k} = $v;
        }

        // Ensure name fields are populated from various possible input keys
        $possibleUserKeys = ['felhasznalonev','felhaszaloNev','felhasznaloNev','username','user','name','userName'];
        $possibleLastKeys = ['vez_nev','vezeteknev','vezetek_nev','veznev','last_name','vezetekNev','vezNev'];
        $possibleFirstKeys = ['ker_nev','keresztnev','kereszt_nev','first_name','keresztNev','kerNev'];

        // felhasznalonev / name / username
        if (in_array('felhasznalonev', $columns) && empty($user->felhasznalonev)) {
            foreach ($possibleUserKeys as $k) {
                if (!empty($input[$k])) { $user->felhasznalonev = trim($input[$k]); break; }
            }
            if (empty($user->felhasznalonev) && !empty($input['email'])) {
                $user->felhasznalonev = strstr($input['email'], '@', true) ?: 'user'.time();
            }
        }
        if (in_array('name', $columns) && empty($user->name)) {
            foreach (['name','felhasznalonev','username'] as $k) { if (!empty($input[$k])) { $user->name = trim($input[$k]); break; } }
            if (empty($user->name) && !empty($user->felhasznalonev)) { $user->name = $user->felhasznalonev; }
        }
        if (in_array('username', $columns) && empty($user->username)) {
            foreach (['username','felhasznalonev','name'] as $k) { if (!empty($input[$k])) { $user->username = trim($input[$k]); break; } }
            if (empty($user->username) && !empty($user->felhasznalonev)) { $user->username = $user->felhasznalonev; }
        }

        // vez_nev
        if (in_array('vez_nev', $columns) && empty($user->vez_nev)) {
            foreach ($possibleLastKeys as $k) { if (!empty($input[$k])) { $user->vez_nev = trim($input[$k]); break; } }
        }
        // ker_nev
        if (in_array('ker_nev', $columns) && empty($user->ker_nev)) {
            foreach ($possibleFirstKeys as $k) { if (!empty($input[$k])) { $user->ker_nev = trim($input[$k]); break; } }
        }

        // As final fallback, derive names from a full name input if present
        if (empty($user->vez_nev) && empty($user->ker_nev) && !empty($input['fullname'])) {
            $parts = preg_split('/\s+/', trim($input['fullname']));
            if (count($parts) >= 2) {
                $user->vez_nev = array_shift($parts);
                $user->ker_nev = implode(' ', $parts);
            }
        }

        $user->save();

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
