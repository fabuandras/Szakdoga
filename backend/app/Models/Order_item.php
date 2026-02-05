<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\OrderItemFactory;

class Order_item extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'rendeles_szam',
        'cikk_szam',
        'mennyiseg',
    ];

    protected $casts = [
        'rendeles_szam' => 'integer',
        'cikk_szam' => 'integer',
        'mennyiseg' => 'integer',
    ];

    /**
     * Megmondjuk Laravelnek, melyik factory tartozik ehhez a modelhez
     */
    protected static function newFactory()
    {
        return OrderItemFactory::new();
    }
}