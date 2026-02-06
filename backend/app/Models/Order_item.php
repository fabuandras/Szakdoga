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

    protected static function newFactory()
    {
        return OrderItemFactory::new();
    }

    // 🔗 KAPCSOLATOK
    public function order()
    {
        return $this->belongsTo(Order::class, 'rendeles_szam', 'rendeles_szam');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'cikk_szam', 'cikk_szam');
    }
}
