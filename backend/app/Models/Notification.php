<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item;
use App\Models\Inventory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type','message','item_id','inventory_id','item_name','quantity','user_id','user_name','reason','note','data','read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'cikk_szam');
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'inventory_id');
    }
}
