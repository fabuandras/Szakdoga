<?php

namespace Database\Factories;

use App\Models\Order_item;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = Order_item::class;

    public function definition(): array
    {
        return [
            'rendeles_szam' => $this->faker->numberBetween(1, 50),
            'cikk_szam' => $this->faker->numberBetween(1, 50),
            'mennyiseg' => $this->faker->numberBetween(1, 10),
        ];
    }
}