<?php

namespace Database\Seeders;

use App\Models\Package_pickup;
use Illuminate\Database\Seeder;


class PackagePickupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        Package_pickup::create([
            'atveteli_pont' => 'Budapest, Fő utca 12. – GLS Pont',
            'szallitasi_ceg' => 'GLS',
            'cimID' => 1,
        ]);

        Package_pickup::create([
            'atveteli_pont' => 'Debrecen, Piac utca 5. – MPL PostaPont',
            'szallitasi_ceg' => 'MPL',
            'cimID' => 2,
        ]);

        Package_pickup::create([
            'atveteli_pont' => 'Szeged, Kárász utca 22. – Foxpost Automata',
            'szallitasi_ceg' => 'Foxpost',
            'cimID' => 3,
        ]);

        Package_pickup::create([
            'atveteli_pont' => 'Győr, Baross út 8. – DPD Pickup Pont',
            'szallitasi_ceg' => 'DPD',
            'cimID' => 4,
        ]);

        Package_pickup::create([
            'atveteli_pont' => 'Pécs, Király utca 14. – Packeta Z-Box',
            'szallitasi_ceg' => 'Packeta',
            'cimID' => 5,
        ]);

        Package_pickup::create([
            'atveteli_pont' => 'Miskolc, Széchenyi utca 3. – GLS CsomagPont',
            'szallitasi_ceg' => 'GLS',
            'cimID' => 6,
        ]);
    }
}
