<?php

namespace Database\Factories;

use App\Models\Card_detail;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
{
    return [
        'fiz_mod' => $this->faker->randomElement(['Kártya', 'Készpénz', 'Utalás']),
        'kuponkod' => strtoupper($this->faker->bothify('??####??')),
        // Ha van kártya, azt használja, ha nincs, automatikusan létrehoz egyet:
        'kartyaID' => Card_detail::inRandomOrder()->first()?->kartyaID ?? Card_detail::factory(),
    ];
}
}
