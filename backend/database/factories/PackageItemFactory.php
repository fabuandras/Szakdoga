<?php

namespace Database\Factories;

use App\Models\Package;
use App\Models\Order;
use App\Models\Item;
use App\Models\Package_item;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageItemFactory extends Factory
{
    protected $model = Package_item::class;

    public function definition(): array
    {
        return [
           
        ];
    }
}
