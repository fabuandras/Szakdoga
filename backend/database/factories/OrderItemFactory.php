<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Item;
use App\Models\Order_item;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = Order_item::class;

    public function definition(): array
    {
        return [
            'rendeles_szam' => Order::inRandomOrder()->first()?->rendeles_szam ?? Order::factory()->create()->rendeles_szam,
            'cikk_szam' => Item::inRandomOrder()->first()?->cikk_szam ?? Item::factory()->create()->cikk_szam,
            'mennyiseg'     => $this->faker->numberBetween(1, 10),
        ];
    }
}
