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
        ];
    }
}
