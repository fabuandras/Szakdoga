<?php

namespace Database\Seeders;

use App\Models\Order_item;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        Order_item::factory(10)->create();

        Order_item::create([
            'rendeles_szam' => 1,
            'cikk_szam' => 1,
            'mennyiseg' => 2,
        ]);
    }
}