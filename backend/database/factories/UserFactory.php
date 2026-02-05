<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vKod' => $this->faker->bothify('??##'), // pl: AB12
            'vez_nev' => $this->faker->lastName(),
            'ker_nev' => $this->faker->firstName(),
            'jelszo' => Hash::make('password'),      // mindig hash-elve!
            'email' => $this->faker->unique()->safeEmail(),
            'megszolitas' => $this->faker->randomElement(['Mr', 'Mrs', 'Ms', 'Dr']),
            'tel_szam' => $this->faker->numberBetween(1, 9), // tinyint miatt kicsi szám
            'szul_datum' => $this->faker->date(),
        ];
    }
}