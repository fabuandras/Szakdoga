<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package_item;

class PackageItemSeeder extends Seeder
{
    public function run(): void
    {
        Package_item::create([
            'csKod' => 2,
            'rendeles_szam' => 1,
            'cikk_szam' => 1,
            'menny' => 2,
        ]);

        Package_item::create([
            'csKod' => 3,
            'rendeles_szam' => 2,
            'cikk_szam' => 2,
            'menny' => 1,
        ]);

        Package_item::create([
            'csKod' => 4,
            'rendeles_szam' => 3,
            'cikk_szam' => 3,
            'menny' => 4,
        ]);

        Package_item::create([
            'csKod' => 5,
            'rendeles_szam' => 4,
            'cikk_szam' => 4,
            'menny' => 1,
        ]);

        Package_item::create([
            'csKod' => 6,
            'rendeles_szam' => 5,
            'cikk_szam' => 5,
            'menny' => 3,
        ]);

        Package_item::create([
            'csKod' => 7,
            'rendeles_szam' => 6,
            'cikk_szam' => 6,
            'menny' => 2,
        ]);
    }
}
