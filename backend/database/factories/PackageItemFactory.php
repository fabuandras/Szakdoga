<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Order;
use App\Models\Package;
use App\Models\Package_item;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageItemFactory extends Factory
{
    protected $model = Package_item::class;

    public function definition(): array
    {
        return [
            'csKod' => Package::inRandomOrder()->first()?->csKod ?? 'PKG1',
            'rendeles_szam' => Order::inRandomOrder()->first()?->rendeles_szam ?? 1,
            'cikk_szam' => Item::inRandomOrder()->first()?->cikk_szam ?? 1,
            'menny' => $this->faker->numberBetween(1, 10),
        ];
    }
}