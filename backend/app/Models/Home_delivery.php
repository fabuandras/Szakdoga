<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Home_delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'orszag',
        'helyseg',
        'hazszam',
        'iranyito_szam',
        'varos',
        'cimID',
    ];
}
