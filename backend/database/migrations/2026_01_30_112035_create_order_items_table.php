<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            // először az oszlopok (alapértékkel)
            $table->unsignedBigInteger('rendeles_szam')->default(1);
            $table->unsignedBigInteger('cikk_szam')->default(1);
            $table->integer('mennyiseg')->default(1);
            $table->decimal('fizId', 10, 2)->default(0.00);

            $table->timestamps();

            // majd a composite primary és foreign key definíciók
            $table->primary(['rendeles_szam', 'cikk_szam']);
            $table->foreign('rendeles_szam')->references('rendeles_szam')->on('orders');
            $table->foreign('cikk_szam')->references('cikk_szam')->on('items');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
