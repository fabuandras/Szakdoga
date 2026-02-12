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
        Package::factory(10)->create();

        // 1 fix csomag
        Package::create([
            //'csKod' => 'CS01',
            'datum' => '2024-01-01',
        ]);
    }
}