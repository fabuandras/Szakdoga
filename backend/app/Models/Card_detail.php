<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card_detail extends Model
{
    use HasFactory;

    protected $fillable = [
        'kartya_szam',
        'lejarati_datum',
        'biz_kod',
        'kartya_nev',
        'kartyaID',
    ];

    // 🔗 KAPCSOLAT
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'kartyaID', 'fizID');
    }
}
