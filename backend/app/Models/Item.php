<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'cikk_szam',
        'elnevezes',
        'akt_keszlet',
        'egyseg_ar',
    ];

    // 🔗 KAPCSOLAT
    public function orderItems()
    {
        return $this->hasMany(Order_item::class, 'cikk_szam', 'cikk_szam');
    }
}
