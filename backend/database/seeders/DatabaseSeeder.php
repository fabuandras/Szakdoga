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
        // No hardcoded users here. Users must register through the UI
        // which will create `felhasznalonev` + `jelszo` entries in the DB.
        // For testing, use factories (uncomment below) or separate test seeders.
        // User::factory()->create();


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
