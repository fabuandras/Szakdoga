<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package_item extends Model
{
    protected $table = 'package_items';

    public $incrementing = false;
    public $timestamps = false;

    /**
     * Laravel nem támogatja natívan a composite primary key-t,
     * ezért itt tömbként tároljuk, és a mentés query-jét felülírjuk.
     */
    protected $primaryKey = ['csKod', 'rendeles_szam', 'cikk_szam'];

    protected $fillable = [
        'csKod',
        'rendeles_szam',
        'cikk_szam',
        'menny',
    ];

    protected $casts = [
        'rendeles_szam' => 'integer',
        'cikk_szam' => 'integer',
        'menny' => 'integer',
    ];

    /**
     * Composite key mentés támogatása (update esetén).
     * FONTOS: a metódus szignatúrája paraméter nélküli kell legyen,
     * hogy kompatibilis legyen a Model ősosztállyal.
     */
    protected function setKeysForSaveQuery($query)
    {
        $query->where('csKod', $this->getAttribute('csKod'))
              ->where('rendeles_szam', $this->getAttribute('rendeles_szam'))
              ->where('cikk_szam', $this->getAttribute('cikk_szam'));

        return $query;
    }

    /* =====================
       Kapcsolatok
       ===================== */

    public function package()
    {
        return $this->belongsTo(Package::class, 'csKod', 'csKod');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'rendeles_szam', 'rendeles_szam');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'cikk_szam', 'cikk_szam');
    }
}