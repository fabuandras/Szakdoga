<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'csKod' => $this->faker->unique()->numberBetween(1, 1000),
            'datum' => $this->faker->date(),

        ];
    }
}
