<?php

namespace Database\Factories;

use App\Models\Home_delivery;
use App\Models\Package_pickup;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackagePickupFactory extends Factory
{
    protected $model = Package_pickup::class;

    public function definition(): array
    {
        return [
            'atveteli_pont' => $this->faker->streetAddress(),
            'szallitasi_ceg' => $this->faker->company(),
            'cimID' => \App\Models\Home_delivery::factory(),
        ];
    }
}
