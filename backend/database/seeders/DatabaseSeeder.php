<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Users
        User::factory(10)->create();

        User::create([
            //'vKod' => 'AB12',
            'vez_nev' => 'Teszt',
            'ker_nev' => 'Elek',
            'jelszo' => Hash::make('password'),
            'email' => 'test@example.com',
            'megszolitas' => 'Mr',
            'tel_szam' => 7,
            'szul_datum' => '2000-01-01',
        ]);

        // Seederek
        $this->call([
            PackageSeeder::class,
            ItemSeeder::class,
            CardDetailSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            PaymentSeeder::class,
            PackagePickupSeeder::class,
        ]);
    }
}