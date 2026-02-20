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
        //User::factory()->create();

        User::create([
            'vKod' => 2,
            'vez_nev' => 'Teszt',
            'ker_nev' => 'Elek',
            'jelszo' => Hash::make('password'),
            'email' => 'test@example.com',
            'megszolitas' => 'Mr',
            'tel_szam' => '06301234567',
            'szul_datum' => '2000-01-01',
        ]);
        User::create([
            'vKod' => 3,
            'vez_nev' => 'Kiss',
            'ker_nev' => 'Anna',
            'jelszo' => Hash::make('password123'),
            'email' => 'anna.kiss@example.com',
            'megszolitas' => 'Ms',
            'tel_szam' => '06301112222',
            'szul_datum' => '1995-05-12',
        ]);

        User::create([
            'vKod' => 4,
            'vez_nev' => 'Nagy',
            'ker_nev' => 'Béla',
            'jelszo' => Hash::make('securepass'),
            'email' => 'bela.nagy@example.com',
            'megszolitas' => 'Mr',
            'tel_szam' => '06302223333',
            'szul_datum' => '1988-09-23',
        ]);

        User::create([
            'vKod' => 5,
            'vez_nev' => 'Szabó',
            'ker_nev' => 'Csilla',
            'jelszo' => Hash::make('mypassword'),
            'email' => 'csilla.szabo@example.com',
            'megszolitas' => 'Mrs',
            'tel_szam' => '06303334444',
            'szul_datum' => '1992-03-17',
        ]);

        User::create([
            'vKod' => 6,
            'vez_nev' => 'Tóth',
            'ker_nev' => 'Dániel',
            'jelszo' => Hash::make('danielpass'),
            'email' => 'daniel.toth@example.com',
            'megszolitas' => 'Mr',
            'tel_szam' => '06304445555',
            'szul_datum' => '1990-12-01',
        ]);

        User::create([
            'vKod' => 7,
            'vez_nev' => 'Horváth',
            'ker_nev' => 'Erika',
            'jelszo' => Hash::make('erika123'),
            'email' => 'erika.horvath@example.com',
            'megszolitas' => 'Ms',
            'tel_szam' => '06305556666',
            'szul_datum' => '1998-07-29',
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
