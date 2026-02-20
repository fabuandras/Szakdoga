<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'rendeles_szam';

    protected $fillable = [
        'rendeles_szam',
        'kelt',
        'vKod',
        'csKod',
    ];

    protected $casts = [
        'kelt' => 'date',
    ];

    // 🔗 KAPCSOLATOK
    public function user()
    {
        return $this->belongsTo(User::class, 'vKod', 'vKod');
    }

    public function orderItems()
    {
        return $this->hasMany(Order_item::class, 'rendeles_szam', 'rendeles_szam');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'csKod', 'csKod');
    }
}
