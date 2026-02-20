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
        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000001,
            'lejarati_datum'  => 2,
            'biz_kod'         => 101,
            'kartya_nev'      => 'Teszt Kártya 1',
        ]);

        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000002,
            'lejarati_datum'  => 3,
            'biz_kod'         => 102,
            'kartya_nev'      => 'Teszt Kártya 2',
        ]);

        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000003,
            'lejarati_datum'  => 4,
            'biz_kod'         => 103,
            'kartya_nev'      => 'Teszt Kártya 3',
        ]);

        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000004,
            'lejarati_datum'  => 5,
            'biz_kod'         => 104,
            'kartya_nev'      => 'Teszt Kártya 4',
        ]);

        \App\Models\Card_detail::factory()->create([
            'kartya_szam'     => 10000005,
            'lejarati_datum'  => 6,
            'biz_kod'         => 105,
            'kartya_nev'      => 'Teszt Kártya 5',
        ]);
    }
}
