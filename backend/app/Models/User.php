<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Tömegesen feltölthető mezők
     */
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

    /**
     * Rejtett mezők (JSON / API)
     */
    protected $hidden = [
        'jelszo',
    ];

    /**
     * Típuskonverziók
     */
    protected function casts(): array
    {
        return [
            'szul_datum' => 'date',
        ];
    }

    /**
     * Laravel Auth számára megmondjuk,
     * hogy a jelszó mező neve: jelszo
     */
    public function getAuthPassword()
    {
        return $this->jelszo;
    }
}