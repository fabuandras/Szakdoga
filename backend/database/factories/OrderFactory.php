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
            'kelt'  => $this->faker->date(),
            'vKod'  => User::inRandomOrder()->first()->vKod,
            'csKod' => Package::inRandomOrder()->first()->csKod,
        ];
    }
}
