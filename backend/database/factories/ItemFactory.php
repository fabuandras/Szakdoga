<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'elnevezes'   => $this->faker->words(2, true),
            'akt_keszlet' => $this->faker->numberBetween(0, 100),
            'egyseg_ar'   => $this->faker->randomFloat(2, 100, 10000),
        ];
    }
}
