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
        \App\Models\Order::create([
            'rendeles_szam' => 2,
            'kelt' => now(),
            'vKod' => 3,
            'csKod' => 3,
        ]);

        \App\Models\Order::create([
            'rendeles_szam' => 3,
            'kelt' => now(),
            'vKod' => 4,
            'csKod' => 4,
        ]);

        \App\Models\Order::create([
            'rendeles_szam' => 4,
            'kelt' => now(),
            'vKod' => 5,
            'csKod' => 5,
        ]);

        \App\Models\Order::create([
            'rendeles_szam' => 5,
            'kelt' => now(),
            'vKod' => 6,
            'csKod' => 6,
        ]);

        \App\Models\Order::create([
            'rendeles_szam' => 6,
            'kelt' => now(),
            'vKod' => 7,
            'csKod' => 7,
        ]);
    }
}
