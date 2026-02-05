<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rendeles_szam' => $this->faker->numberBetween(1, 255),
            'kelt'          => $this->faker->date(),
            'vKod'          => strtoupper($this->faker->lexify('????')),
            'csKod'         => strtoupper($this->faker->lexify('????')),
        ];
    }
}
