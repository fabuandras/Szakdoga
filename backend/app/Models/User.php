<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'vKod',
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
    ];

    protected function casts(): array
    {
        return [
            'szul_datum' => 'date',
        ];
    }

    public function getAuthPassword()
    {
        return $this->jelszo;
    }

    // 🔗 KAPCSOLAT
    public function orders()
    {
        return $this->hasMany(Order::class, 'vKod', 'vKod');
    }
}
