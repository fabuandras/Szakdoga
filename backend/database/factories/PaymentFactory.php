<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fiz_mod' => $this->faker->randomElement(['Kártya', 'Készpénz', 'Utalás']),
            'kuponkod' => strtoupper($this->faker->bothify('??####??')), // 8 karakter, biztos belefér a 10-be
            'fizID' => $this->faker->numberBetween(1, 9),
        ];
    }
}