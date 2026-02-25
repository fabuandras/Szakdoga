<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'felhasznalonev' => $this->faker->unique()->userName(),
            'vez_nev' => $this->faker->lastName(),
            'ker_nev' => $this->faker->firstName(),
            'jelszo' => Hash::make('password'),
            'email' => $this->faker->unique()->safeEmail(),
            'megszolitas' => $this->faker->randomElement(['Mr','Ms','Miss','Dr']),
            'tel_szam' => $this->faker->phoneNumber(),
            'szul_datum' => $this->faker->date('Y-m-d', '-18 years'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
