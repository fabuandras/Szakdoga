<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
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
    public function store(Request $request)
    {
        // basic validation (adjust as needed)
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        // prepare data only for existing columns
        $columns = Schema::hasTable('users') ? Schema::getColumnListing('users') : [];

        // fetch column types to handle date/datetime normalization
        $colTypes = [];
        try {
            if (! empty($columns)) {
                $rawCols = DB::select("SHOW COLUMNS FROM `users`");
                foreach ($rawCols as $c) {
                    $colTypes[$c->Field] = $c->Type;
                }
            }
        } catch (\Throwable $e) {
            // ignore
        }

        $input = $request->all();
        $data = [];

        // Email
        if (in_array('email', $columns) && isset($input['email'])) {
            $data['email'] = $input['email'];
        }

        // Explicit whitelist mapping: map frontend fields to DB columns (choose first available column)
        $whitelist = [
            'felhasznalonev' => ['name','username','felhasznalonev'],
            'vez_nev' => ['vezeteknev','vezetek_nev','last_name'],
            'ker_nev' => ['keresztnev','kereszt_nev','first_name'],
            'megszolitas' => ['megszolitas','title'],
            'telefonszam' => ['telefonszam','phone','telefon'],
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

        // Handle password field: fill into existing column name
        if (in_array('password', $columns)) {
            $data['password'] = Hash::make($input['password']);
        } elseif (in_array('jelszo', $columns)) {
            $data['jelszo'] = Hash::make($input['password']);
        }

        // Timestamps
        if (in_array('created_at', $columns) && ! isset($data['created_at'])) {
            $data['created_at'] = now();
        }
        if (in_array('updated_at', $columns) && ! isset($data['updated_at'])) {
            $data['updated_at'] = now();
        }

        // Fill required NOT NULL columns without defaults
        try {
            $raw = DB::select("SHOW COLUMNS FROM `users`");
            foreach ($raw as $col) {
                $field = $col->Field;
                $nullable = ($col->Null === 'YES');
                $hasDefault = ! is_null($col->Default);
                $extra = $col->Extra; // e.g., auto_increment

                if (! in_array($field, $columns)) continue;

                if ($nullable === false && ! $hasDefault && ! isset($data[$field]) && stripos($extra, 'auto_increment') === false) {
                    // set sensible defaults
                    if ($field === 'felhasznalonev') {
                        // derive from input name or email
                        if (! empty($input['felhasznalonev'])) {
                            $data[$field] = $input['felhasznalonev'];
                        } elseif (! empty($input['email'])) {
                            $data[$field] = strstr($input['email'], '@', true) ?: $input['email'];
                        } else {
                            $data[$field] = 'user' . time();
                        }
                    } elseif (in_array($field, ['created_at','updated_at'])) {
                        $data[$field] = now();
                    } elseif ($field === 'email') {
                        $data[$field] = $input['email'] ?? '';
                    } else {
                        // default to empty string to satisfy NOT NULL
                        $data[$field] = '';
                    }
                }
            }
        } catch (\Throwable $e) {
            // ignore SHOW COLUMNS errors, proceed
        }

        try {
            // create user via property assignment to avoid fillable/mass-assignment issues
            $user = new User();
            foreach ($data as $k => $v) {
                $user->{$k} = $v;
            }
            $user->save();

            // create token if sanctum available
            $token = null;
            try {
                if (method_exists($user, 'createToken')) {
                    $token = $user->createToken('api-token')->plainTextToken;
                }
            } catch (\Throwable $e) {
                // ignore token creation errors
            }

            return response()->json(['user' => $user, 'token' => $token], 201);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Registration failed', 'error' => $e->getMessage()], 500);
        }
    }
}
