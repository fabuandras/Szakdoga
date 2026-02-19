<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('rendeles_szam');
            $table->date('kelt');

            $table->foreignId('vKod')->references('vKod')->on('users');
            $table->foreignId('csKod')->references('csKod')->on('packages');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
