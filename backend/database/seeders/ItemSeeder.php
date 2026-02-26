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
        $items = [
            ['cikk_szam' => 1, 'elnevezes' => 'Pamut fonal – 100g', 'akt_keszlet' => 180, 'egyseg_ar' => 2.99], // kb. 1100 Ft
            ['cikk_szam' => 2, 'elnevezes' => 'Horgolótű – 3.5 mm', 'akt_keszlet' => 120, 'egyseg_ar' => 1.49], // kb. 550 Ft
            ['cikk_szam' => 3, 'elnevezes' => 'Akryl fonal – 100g', 'akt_keszlet' => 200, 'egyseg_ar' => 1.99], // kb. 750 Ft
            ['cikk_szam' => 4, 'elnevezes' => 'Horgolótű készlet (2–6 mm)', 'akt_keszlet' => 60, 'egyseg_ar' => 6.49], // kb. 2400 Ft
            ['cikk_szam' => 5, 'elnevezes' => 'Biztosítótű jelölők – 20 db', 'akt_keszlet' => 300, 'egyseg_ar' => 1.29], // kb. 500 Ft
            ['cikk_szam' => 6, 'elnevezes' => 'Amigurumi fonal – 50g', 'akt_keszlet' => 150, 'egyseg_ar' => 2.49], // kb. 950 Ft
        ];

        \App\Models\Item::create([
            'cikk_szam' => 2,
            'elnevezes' => 'Horgolótű – 3.5 mm',
            'akt_keszlet' => 120,
            'egyseg_ar' => 1.49, // kb. 550 Ft
        ]);

        \App\Models\Item::create([
            'cikk_szam' => 3,
            'elnevezes' => 'Akryl fonal – 100g',
            'akt_keszlet' => 200,
            'egyseg_ar' => 1.99, // kb. 750 Ft
        ]);

        \App\Models\Item::create([
            'cikk_szam' => 4,
            'elnevezes' => 'Horgolótű készlet (2–6 mm)',
            'akt_keszlet' => 60,
            'egyseg_ar' => 6.49, // kb. 2400 Ft
        ]);

        \App\Models\Item::create([
            'cikk_szam' => 5,
            'elnevezes' => 'Biztosítótű jelölők – 20 db',
            'akt_keszlet' => 300,
            'egyseg_ar' => 1.29, // kb. 500 Ft
        ]);

        \App\Models\Item::create([
            'cikk_szam' => 6,
            'elnevezes' => 'Amigurumi fonal – 50g',
            'akt_keszlet' => 150,
            'egyseg_ar' => 2.49, // kb. 950 Ft
        ]);

        $items = [
            ['cikk_szam' => 45554, 'elnevezes' => 'Fonal - kék', 'akt_keszlet' => 120, 'egyseg_ar' => 4500],
            ['cikk_szam' => 32728, 'elnevezes' => 'Tulip horgolótű', 'akt_keszlet' => 56, 'egyseg_ar' => 1500],
            ['cikk_szam' => 98212, 'elnevezes' => 'Nyuszi plüssfigura', 'akt_keszlet' => 10, 'egyseg_ar' => 6500],
            ['cikk_szam' => 67242, 'elnevezes' => 'Fonal - piros', 'akt_keszlet' => 4, 'egyseg_ar' => 4500],
            ['cikk_szam' => 11223, 'elnevezes' => 'Fonal - zöld', 'akt_keszlet' => 2, 'egyseg_ar' => 4500],
        ];

        foreach ($items as $it) {
            Item::create($it);
        }
    }
}
