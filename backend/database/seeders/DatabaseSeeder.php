<?php

namespace Database\Seeders;

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
                'felhasznalonev' => 'Bori',
                'vez_nev' => 'Ilyés',
                'ker_nev' => 'Borbála',
                'megszolitas' => 'Ms',
                'tel_szam' => '+36 20 789 5634',
                'szul_datum' => '2000-10-10',
                'email' => 'ilyesbori@raktaros.hu',
                'jelszo' => Hash::make('Aa123456@'),
                'kedvencek' => json_encode([]),
                'kosar' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'felhasznalonev' => 'Anna',
                'vez_nev' => 'Kiss',
                'ker_nev' => 'Anna',
                'megszolitas' => 'Ms',
                'tel_szam' => '+36 30 123 4567',
                'szul_datum' => '1998-05-12',
                'email' => 'anna@webshop.hu',
                'jelszo' => Hash::make('Aa123456@'),
                'kedvencek' => json_encode([]),
                'kosar' => json_encode([]),
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
