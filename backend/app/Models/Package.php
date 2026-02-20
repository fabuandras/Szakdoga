<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $primaryKey = 'csKod';

    protected $fillable = [
        'csKod',
        'datum',
    ];

    protected $casts = [
        'datum' => 'date',
    ];

    // 🔗 KAPCSOLATOK
    public function orders()
    {
        return $this->hasMany(Order::class, 'csKod', 'csKod');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'fizID', 'csKod');
    }

    public function homeDelivery()
    {
        return $this->hasOne(Home_delivery::class, 'cimID', 'csKod');
    }

    public function pickup()
    {
        return $this->hasOne(Package_pickup::class, 'csomagatvetelID', 'csKod');
    }
}
