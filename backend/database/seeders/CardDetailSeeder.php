<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Card_detail;

class CardDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000000,
            'lejarati_datum'  => 1,
            'biz_kod'         => 100,
            'kartya_nev'      => 'Kártya Neve',
        ]);
    }
}
