<?php

namespace Database\Factories;

use App\Models\Card_detail;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardDetailFactory extends Factory
{
    protected $model = Card_detail::class;

    public function definition(): array
    {
        return [
            'kartya_szam'     => $this->faker->numberBetween(10000000, 99999999),
            'lejarati_datum'  => $this->faker->numberBetween(1, 12),
            'biz_kod'         => $this->faker->numberBetween(100, 999),
            'kartya_nev'      => $this->faker->name(),
        ];
    }
}
