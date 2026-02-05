<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\PackagePickupFactory;

class Package_pickup extends Model
{
    use HasFactory;

    protected $table = 'package_pickups';

    protected $fillable = [
        'csomagatvetelID',
        'atveteli_pont',
        'szallitasi_ceg',
    ];

    protected $casts = [
        'csomagatvetelID' => 'integer',
    ];

    /**
     * Megmondjuk Laravelnek, melyik factory tartozik ehhez a modelhez
     */
    protected static function newFactory()
    {
        return PackagePickupFactory::new();
    }
}