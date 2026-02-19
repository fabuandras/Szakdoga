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
           // \App\Models\Order_item::factory()->create([
                //'rendeles_szam' => $order->rendeles_szam,
                //'cikk_szam' => $items->random()->cikk_szam,
            //]);
        }
        
        \App\Models\Order_item::create([
            'rendeles_szam' => 1,
            'cikk_szam' => 1,
            'mennyiseg' => 2,
            'fizId' => 200.00,
        ]);
    }
}
