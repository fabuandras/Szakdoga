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
        // 10 random csomagátvétel
        //Package_pickup::factory(10)->create();

        // 1 fix csomagátvétel
        /*Package_pickup::create([
            //'csomagatvetelID' => 1,
            'atveteli_pont' => 'Budapest, Fő utca 1.',
            'szallitasi_ceg' => 'GLS',
        ]);*/
    }
}