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
        \App\Models\Card_detail::factory(10)->create();
    }
}
