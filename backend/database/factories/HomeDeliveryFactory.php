<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HomeDeliveryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'orszag'        => $this->faker->country(),
            'helyseg'       => $this->faker->city(),
            'hazszam'       => $this->faker->numberBetween(1, 200),
            'iranyito_szam' => $this->faker->numberBetween(1000, 9999),
            'varos'         => $this->faker->city(),
        ];
    }
}
