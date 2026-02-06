<?php

namespace Database\Seeders;

use App\Models\Order_item;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::table('order_items')->insertOrIgnore(
            Order_item::factory(10)->make()->toArray()
        );

        Order_item::create([
            'rendeles_szam' => 1,
            'cikk_szam' => 1,
            'mennyiseg' => 2,
        ]);
    }
}