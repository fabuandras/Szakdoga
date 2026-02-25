<?php

namespace Database\Seeders;

use App\Models\Order_item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = \App\Models\Item::all();
        $orders = \App\Models\Order::all();
        $payments = \App\Models\Payment::all()->pluck('fizID')->toArray();

        if ($orders->isEmpty() || $items->isEmpty()) {
            // nincs mit betölteni
            return;
        }

        foreach ($orders as $order) {
            $count = rand(1, 3);
            $count = min($count, $items->count());

            $selectedItems = $items->shuffle()->take($count);

            foreach ($selectedItems as $item) {
                $paymentId = empty($payments) ? null : $payments[array_rand($payments)];

                DB::table('order_items')->insertOrIgnore([
                    'rendeles_szam' => $order->rendeles_szam,
                    'cikk_szam' => $item->cikk_szam,
                    'mennyiseg' => rand(1, 5),
                    'fizId' => $paymentId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
