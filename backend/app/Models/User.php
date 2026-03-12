<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'vKod';

    protected $fillable = [
        'felhasznalonev',
        'vez_nev',
        'ker_nev',
        'jelszo',
        'email',
        'megszolitas',
        'tel_szam',
        'szul_datum',
        'kedvencek',
        'kosar',
    ];

    protected $hidden = [
        'jelszo',
        'remember_token',
    ];

    protected $casts = [
        'szul_datum' => 'date',
        'kedvencek' => 'array',
        'kosar' => 'array',
    ];

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
