<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'rendeles_szam' => $this->faker->unique()->numberBetween(1, 99999),
            'kelt'  => $this->faker->date(),
            // Ha nincs User, csinál egyet, különben vesz egy létezőt
            'vKod'  => User::inRandomOrder()->first()?->vKod ?? User::factory(),
            'csKod' => Package::inRandomOrder()->first()?->csKod ?? Package::factory(),
        ];
    }
}
