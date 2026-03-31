<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventories';

    protected $fillable = [
        'code',
        'status',
        'started_by',
        'closed_by',
        'started_at',
        'closed_at',
        'note',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function lines()
    {
        return DB::table('inventory_items')
            ->where('inventory_id', $this->id)
            ->orderBy('item_name')
            ->get();
    }

    public function lineStats(): object
    {
        return DB::table('inventory_items')
            ->where('inventory_id', $this->id)
            ->selectRaw('COUNT(*) as lines_count, COALESCE(SUM(system_quantity),0) as total_system_quantity, COALESCE(SUM(counted_quantity),0) as total_counted_quantity')
            ->first();
    }
}
