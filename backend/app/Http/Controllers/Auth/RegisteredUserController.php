<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
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

        $input = $request->all();
        $data = [];

        // Email
        if (in_array('email', $columns) && isset($input['email'])) {
            $data['email'] = $input['email'];
        }

        // Map felhasznalonev to name/username/felhasznalonev
        if (isset($input['felhasznalonev'])) {
            if (in_array('name', $columns)) {
                $data['name'] = $input['felhasznalonev'];
            } elseif (in_array('username', $columns)) {
                $data['username'] = $input['felhasznalonev'];
            } elseif (in_array('felhasznalonev', $columns)) {
                $data['felhasznalonev'] = $input['felhasznalonev'];
            }
        }

        // Copy any other input keys that match existing columns
        foreach ($input as $key => $value) {
            if (in_array($key, $columns) && ! array_key_exists($key, $data) && $key !== 'password' && $key !== 'password_confirmation') {
                $data[$key] = $value;
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

        try {
            $user = User::create($data);
            return response()->json(['user' => $user], 201);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Registration failed', 'error' => $e->getMessage()], 500);
        }
    }
}
