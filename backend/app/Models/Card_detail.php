<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card_detail extends Model
{
    use HasFactory;
    
    protected $table = 'card_details';
    protected $primaryKey = 'kartyaID';
    public $timestamps = false;

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

    // 🔧 FONTOS: Factory kézi összekötése
    protected static function newFactory()
    {
        return \Database\Factories\CardDetailFactory::new();
    }
}
