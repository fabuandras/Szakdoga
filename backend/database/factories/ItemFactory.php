<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cikk_szam'   => $this->faker->numberBetween(1, 255),
            'elnevezes'   => $this->faker->words(2, true),
            'akt_keszlet' => $this->faker->numberBetween(0, 100),
            'egyseg_ar'   => $this->faker->randomFloat(2, 100, 10000),
        ];
    }
}
