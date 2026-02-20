<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 10 random csomag
        // Package::factory(10)->create();

        // 1 fix csomag
        Package::create([
            'csKod' => 2,
            'datum' => '2024-01-01',
        ]);
        Package::create([
            'csKod' => 3,
            'datum' => '2024-01-05',
        ]);

        Package::create([
            'csKod' => 4,
            'datum' => '2024-01-10',
        ]);

        Package::create([
            'csKod' => 5,
            'datum' => '2024-01-15',
        ]);

        Package::create([
            'csKod' => 6,
            'datum' => '2024-01-20',
        ]);

        Package::create([
            'csKod' => 7,
            'datum' => '2024-01-25',
        ]);
    }
}
