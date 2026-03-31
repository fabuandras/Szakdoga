<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('inventories') || ! Schema::hasTable('inventory_items') || ! Schema::hasTable('items')) {
            return;
        }

        DB::table('inventory_items')->delete();
        DB::table('inventories')->delete();

        $inventoryId = DB::table('inventories')->insertGetId([
            'code' => 'LELTAR-INITIAL',
            'status' => 'closed',
            'started_by' => null,
            'closed_by' => null,
            'started_at' => now(),
            'closed_at' => now(),
            'note' => 'Automatikus kezdő leltár seed.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $items = DB::table('items')
            ->select('cikk_szam', 'elnevezes', 'akt_keszlet')
            ->orderBy('elnevezes')
            ->get();

        $rows = [];
        foreach ($items as $item) {
            $qty = (int) ($item->akt_keszlet ?? 0);
            $rows[] = [
                'inventory_id' => $inventoryId,
                'item_id' => (int) ($item->cikk_szam ?? 0),
                'item_name' => (string) ($item->elnevezes ?? ''),
                'item_sku' => (string) ($item->cikk_szam ?? ''),
                'system_quantity' => $qty,
                'counted_quantity' => $qty,
                'damaged_quantity' => 0,
                'difference' => 0,
                'note' => 'Kezdő leltár seed sor.',
                'counted_by' => null,
                'counted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (! empty($rows)) {
            foreach (array_chunk($rows, 500) as $chunk) {
                DB::table('inventory_items')->insert($chunk);
            }
        }
    }
}
