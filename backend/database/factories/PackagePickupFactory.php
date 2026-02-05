<?php

namespace Database\Factories;

use App\Models\Package_pickup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package_pickup>
 */
class PackagePickupFactory extends Factory
{
    protected $model = Package_pickup::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'csomagatvetelID' => $this->faker->numberBetween(1, 9),
            'atveteli_pont' => $this->faker->streetAddress(),
            'szallitasi_ceg' => $this->faker->company(),
        ];
    }
}