<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Package as PackageModel;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create orders only when the referenced user and package exist.
        $candidates = [
            ['vKod' => 2, 'csKod' => 2],
            ['vKod' => 3, 'csKod' => 3],
            ['vKod' => 4, 'csKod' => 4],
            ['vKod' => 5, 'csKod' => 5],
            ['vKod' => 6, 'csKod' => 6],
            ['vKod' => 7, 'csKod' => 7],
        ];

        foreach ($candidates as $c) {
            $userExists = User::where('vKod', $c['vKod'])->exists();
            $packageExists = PackageModel::where('csKod', $c['csKod'])->exists();

            if ($userExists && $packageExists) {
                Order::create([
                    'kelt' => now(),
                    'vKod' => $c['vKod'],
                    'csKod' => $c['csKod'],
                ]);
            }
        }
    }
}
