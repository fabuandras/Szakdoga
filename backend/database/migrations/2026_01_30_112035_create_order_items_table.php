<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {

            $table->tinyInteger('rendeles_szam');
            $table->tinyInteger('cikk_szam');
            $table->tinyInteger('mennyiseg');

            $table->primary(['rendeles_szam', 'cikk_szam']);

            $table->foreign('rendeles_szam')->references('rendeles_szam')->on('orders');
            $table->foreign('cikk_szam')->references('cikk_szam')->on('items');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
