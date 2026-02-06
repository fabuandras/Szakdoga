<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'csKod' => 'CS' . str_pad((string) $this->faker->unique()->numberBetween(2, 99), 2, '0', STR_PAD_LEFT),
            'datum' => $this->faker->date(),

        ];
    }
}
