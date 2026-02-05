<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'rendeles_szam',
        'kelt',
        'vKod',
        'csKod',
    ];

    protected $casts = [
        'kelt' => 'date',
    ];
}
