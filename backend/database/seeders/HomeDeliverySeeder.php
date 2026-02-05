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
        Home_delivery::factory()->count(10)->create();
    }
}
