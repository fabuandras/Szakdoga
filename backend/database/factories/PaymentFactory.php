<?php

namespace Database\Factories;

use App\Models\Card_detail;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        $card = Card_detail::inRandomOrder()->first();

        return [
            'fiz_mod' => $this->faker->randomElement(['Kártya', 'Készpénz', 'Utalás']),
            'kuponkod' => strtoupper($this->faker->bothify('??####??')),
            'kartyaID' => $card?->kartyaID,   // ha nincs kártya, ne dobjon hibát
        ];
    }
}
