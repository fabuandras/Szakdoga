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
        $packages = [
            ['csKod' => 2, 'datum' => '2024-01-01'],
            ['csKod' => 3, 'datum' => '2024-01-05'],
            ['csKod' => 4, 'datum' => '2024-01-10'],
            ['csKod' => 5, 'datum' => '2024-01-15'],
            ['csKod' => 6, 'datum' => '2024-01-20'],
            ['csKod' => 7, 'datum' => '2024-01-25'],
        ];

        foreach ($packages as $p) {
            Package::updateOrCreate(
                ['csKod' => $p['csKod']],
                ['datum' => $p['datum']]
            );
        }
    }
}
