<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Home_delivery>
 */
class HomeDeliveryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'orszag'        => $this->faker->country(),
            'helyseg'       => $this->faker->city(),
            'hazszam'       => $this->faker->numberBetween(1, 200),
            'iranyito_szam' => $this->faker->numberBetween(1000, 9999),
            'varos'         => $this->faker->city(),
            'cimID'         => $this->faker->numberBetween(1, 255),
        ];
    }
}
