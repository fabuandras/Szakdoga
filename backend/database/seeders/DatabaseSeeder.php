<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure fresh data: disable foreign key checks, truncate users, then re-enable
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert test users using the project's column names (including 'jelszo')
        DB::table('users')->insert([
            [
                'felhasznalonev' => 'admin',
                'vez_nev' => 'Admin',
                'ker_nev' => 'User',
                'megszolitas' => '',
                'tel_szam' => '0612345678',
                'szul_datum' => '1990-01-01',
                'email' => 'admin@example.com',
                'jelszo' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'felhasznalonev' => 'jdoe',
                'vez_nev' => 'Doe',
                'ker_nev' => 'John',
                'megszolitas' => '',
                'tel_szam' => '0612345678',
                'szul_datum' => '1990-01-01',
                'email' => 'jdoe@example.com',
                'jelszo' => Hash::make('secret123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'felhasznalonev' => 'asmith',
                'vez_nev' => 'Smith',
                'ker_nev' => 'Anna',
                'megszolitas' => '',
                'tel_szam' => '0698765432',
                'szul_datum' => '1995-05-05',
                'email' => 'asmith@example.com',
                'jelszo' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);


        // Seederek (Payment kell az OrderItem előtt)
        $this->call([
            HomeDeliverySeeder::class,
            PackageSeeder::class,
            ItemSeeder::class,
            CardDetailSeeder::class,
            PaymentSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            PackagePickupSeeder::class,
        ]);
    }
}
