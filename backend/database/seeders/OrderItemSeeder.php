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
            'cikk_szam' => 1, // Pamut fonal
            'mennyiseg' => 2,
            'fizID' => 1,
        ]);

        \App\Models\Order_item::create([
            'rendeles_szam' => 2,
            'cikk_szam' => 2, // Horgolótű 3.5 mm
            'mennyiseg' => 1,
            'fizID' => 2,
        ]);

        \App\Models\Order_item::create([
            'rendeles_szam' => 3,
            'cikk_szam' => 3, // Akryl fonal
            'mennyiseg' => 4,
            'fizID' => 3,
        ]);

        \App\Models\Order_item::create([
            'rendeles_szam' => 4,
            'cikk_szam' => 4, // Horgolótű készlet
            'mennyiseg' => 1,
            'fizID' => 4,
        ]);

        \App\Models\Order_item::create([
            'rendeles_szam' => 5,
            'cikk_szam' => 5, // Jelölők
            'mennyiseg' => 3,
            'fizID' => 5,
        ]);

        \App\Models\Order_item::create([
            'rendeles_szam' => 6,
            'cikk_szam' => 6, // Amigurumi fonal
            'mennyiseg' => 2,
            'fizID' => 1, // újra felhasználható fizetés
        ]);
    }
}
