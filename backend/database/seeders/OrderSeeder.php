<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // Order::factory()->count(10)->create();
       \App\Models\Order::create([
            'rendeles_szam' => 1,
            'kelt' => now(),
            'vKod' => 2,
            'csKod' => 2,
        ]);
    }
}
