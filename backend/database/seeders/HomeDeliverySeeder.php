<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Home_delivery;

class HomeDeliverySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Budapest',
            'hazszam' => 12,
            'iranyito_szam' => 1134,
            'varos' => 'Budapest',
        ]);

        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Debrecen',
            'hazszam' => 5,
            'iranyito_szam' => 4024,
            'varos' => 'Debrecen',
        ]);

        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Szeged',
            'hazszam' => 22,
            'iranyito_szam' => 6723,
            'varos' => 'Szeged',
        ]);

        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Győr',
            'hazszam' => 8,
            'iranyito_szam' => 9024,
            'varos' => 'Győr',
        ]);

        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Pécs',
            'hazszam' => 14,
            'iranyito_szam' => 7621,
            'varos' => 'Pécs',
        ]);

        Home_delivery::create([
            'orszag' => 'Magyarország',
            'helyseg' => 'Miskolc',
            'hazszam' => 3,
            'iranyito_szam' => 3531,
            'varos' => 'Miskolc',
        ]);
    }
}
