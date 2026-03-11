<?php

use App\Models\Item;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/products-public', function () {
    $selectColumns = ['cikk_szam', 'elnevezes', 'egyseg_ar'];

    if (Schema::hasColumn('items', 'kep_url')) {
        $selectColumns[] = 'kep_url';
    }
    if (Schema::hasColumn('items', 'kartya_hatterszin')) {
        $selectColumns[] = 'kartya_hatterszin';
    }
    if (Schema::hasColumn('items', 'kartya_stilus')) {
        $selectColumns[] = 'kartya_stilus';
    }

    return Item::query()
        ->select($selectColumns)
        ->orderBy('cikk_szam')
        ->limit(20)
        ->get()
        ->map(fn ($item) => [
            'id' => (int) $item->cikk_szam,
            'name' => $item->elnevezes,
            'price' => (float) $item->egyseg_ar,
            'image' => $item->kep_url,
            'cardBackground' => $item->kartya_hatterszin,
            'cardStyle' => $item->kartya_stilus,
        ]);
});

require __DIR__.'/auth.php';
