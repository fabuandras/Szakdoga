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
        // Payment::factory(10)->create();

        // 1 fix fizetés
        // Payment::create([
        // 'fiz_mod' => 'Kártya',
        // 'kuponkod' => 'KUPON2024',
        // 'fizID' => 1,
        //]);
        Payment::create([
            'fiz_mod'  => 'Bankkártya',
            'kuponkod' => 'HORGOLAS10',
            'kartyaID' => 1,
        ]);

        Payment::create([
            'fiz_mod'  => 'Bankkártya',
            'kuponkod' => 'AKCIO2024',
            'kartyaID' => 2,
        ]);

        Payment::create([
            'fiz_mod'  => 'Utánvét',
            'kuponkod' => 'NINCSKUPON',
            'kartyaID' => null, // utánvét → nincs kártya
        ]);

        Payment::create([
            'fiz_mod'  => 'Bankkártya',
            'kuponkod' => 'FONAL5',
            'kartyaID' => 3,
        ]);

        Payment::create([
            'fiz_mod'  => 'PayPal',
            'kuponkod' => 'ONLINE15',
            'kartyaID' => 4,
        ]);
    }
}
