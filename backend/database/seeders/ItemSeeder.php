<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // Item::factory()->count(10)->create();
        \App\Models\Item::create([
            'cikk_szam' => 1,
            'elnevezes' => 'Item 1',
            'akt_keszlet' => 100,
            'egyseg_ar' => 9.99,
            //'kelt' => now(),
            //'vKod' => 2,
            //'csKod' => 2,
        ]);
    }
}
