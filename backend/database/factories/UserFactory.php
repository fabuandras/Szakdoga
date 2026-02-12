<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vez_nev' => $this->faker->lastName(),
            'ker_nev' => $this->faker->firstName(),
            'jelszo' => Hash::make('password'),
            'email' => $this->faker->unique()->safeEmail(),
            'megszolitas' => $this->faker->randomElement(['Mr', 'Mrs', 'Ms', 'Dr']),
            'tel_szam' => $this->faker->numberBetween(1, 9),
            'szul_datum' => $this->faker->date(),
        ];
    }
}
