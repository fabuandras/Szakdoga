<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\OrderItemFactory;

class Order_item extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    // Ha composite kulccsal dolgozol, akkor általában nincs auto increment id:
    public $incrementing = false;
    public $timestamps = false;

    /**
     * Composite kulcs (Laravel natívan nem kezeli, de tároljuk, és felülírjuk a mentést)
     */
    protected $primaryKey = ['rendeles_szam', 'cikk_szam'];

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
     * Példa stílus megmarad, csak a mezőkhöz igazítva.
     * Composite key mentés támogatása (update esetén).
     */
    protected function setKeysForSaveQuery($query)
    {
        $query
            ->where('rendeles_szam', '=', $this->getAttribute('rendeles_szam'))
            ->where('cikk_szam', '=', $this->getAttribute('cikk_szam'));

        return $query;
    }

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