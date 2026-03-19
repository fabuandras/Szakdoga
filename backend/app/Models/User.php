<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'vKod';

    protected $fillable = [
        'felhasznalonev',
        'vez_nev',
        'ker_nev',
        'megszolitas',
        'tel_szam',
        'szul_datum',
        'email',
        'jelszo',
    ];

    protected $hidden = [
        'jelszo',
        'remember_token',
    ];

    protected $casts = [
        'szul_datum' => 'date:Y-m-d',
        'email_verified_at' => 'datetime',
    ];

    // Ensure empty string dates become null and valid dates are formatted
    public function setSzulDatumAttribute($value)
    {
        if ($value === null || $value === '') {
            $this->attributes['szul_datum'] = null;
            return;
        }

        try {
            $this->attributes['szul_datum'] = Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            $this->attributes['szul_datum'] = null;
        }
    }

    /**
     * Return the password for the user for authentication.
     * Supports localized column name 'jelszo' if 'password' column is not present.
     */
    public function getAuthPassword()
    {
        if (isset($this->attributes['password'])) {
            return $this->attributes['password'];
        }

        if (isset($this->attributes['jelszo'])) {
            return $this->attributes['jelszo'];
        }

        return null;
    }

    //  KAPCSOLAT
    public function orders()
    {
        return $this->hasMany(Order::class, 'vKod', 'vKod');
    }
}
