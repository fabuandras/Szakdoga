<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Card_detail>
 */
class CardDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kartya_szam'     => $this->faker->numberBetween(1, 255),
            'lejarati_datum'  => $this->faker->numberBetween(1, 12),
            'biz_kod'         => $this->faker->numberBetween(100, 999),
            'kartya_nev'      => $this->faker->name(),
            'kartyaID'        => $this->faker->numberBetween(1, 255),
        ];
    }
}
