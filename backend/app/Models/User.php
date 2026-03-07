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
    ];

    protected $hidden = [
        'jelszo',
        'remember_token',
    ];

    protected $casts = [
        'szul_datum' => 'date',
    ];

    public function getAuthPassword()
    {
        return $this->jelszo;
    }

    //  KAPCSOLAT
    public function orders()
    {
        return $this->hasMany(Order::class, 'vKod', 'vKod');
    }
}
