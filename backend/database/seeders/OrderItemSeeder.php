<?php

namespace Database\Seeders;

use App\Models\Order_item;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = \App\Models\Item::all();
        $orders = \App\Models\Order::all();

        foreach ($orders as $order) {
            \App\Models\Order_item::factory()->create([
                //'rendeles_szam' => $order->rendeles_szam,
                //'cikk_szam' => $items->random()->cikk_szam,
            ]);
        }
        
        \App\Models\Order_item::create([
           // 'rendeles_szam' => $orders->first()->rendeles_szam,
            //'cikk_szam' => $items->first()->cikk_szam,
            'mennyiseg' => 2,
        ]);
    }
}
