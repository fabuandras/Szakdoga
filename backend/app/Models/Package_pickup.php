<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\PackagePickupFactory;

class Package_pickup extends Model
{
    use HasFactory;

    protected $primaryKey = 'csomagatvetelID';

    protected $table = 'package_pickups';

    protected $fillable = [
        'csomagatvetelID',
        'atveteli_pont',
        'szallitasi_ceg',
    ];

    protected $casts = [
        'csomagatvetelID' => 'integer',
    ];

    protected static function newFactory()
    {
        return PackagePickupFactory::new();
    }

    // 🔗 KAPCSOLAT
    public function package()
    {
        return $this->belongsTo(Package::class, 'csomagatvetelID', 'csKod');
    }
}
