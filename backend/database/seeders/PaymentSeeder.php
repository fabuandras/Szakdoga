<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 10 random fizetés
        Payment::factory(10)->create();

        // 1 fix fizetés
        Payment::create([
            'fiz_mod' => 'Kártya',
            'kuponkod' => 'KUPON2024',
            'kartyaID' => $card?->kartyaID ?? 1,
        ]);
    }
}