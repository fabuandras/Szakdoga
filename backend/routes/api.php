<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use App\Models\Item;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/items', function (Request $request) {
    try {
        if (! class_exists(Item::class) || ! Schema::hasTable('items')) {
            return response()->json([], 200);
        }
        return response()->json(Item::all());
    } catch (\Throwable $e) {
        return response()->json([], 200);
    }
});

Route::get('/items-public', function (Request $request) {
    try {
        if (! class_exists(Item::class) || ! Schema::hasTable('items')) {
            return response()->json([], 200);
        }
        if (Schema::hasColumn('items', 'public')) {
            return response()->json(Item::where('public', 1)->get());
        }
        return response()->json(Item::all());
    } catch (\Throwable $e) {
        return response()->json([], 200);
    }
});
