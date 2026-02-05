<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->tinyInteger('rendeles_szam')->primary();
            $table->date('kelt');

            $table->string('vKod', 4);
            $table->foreign('vKod')->references('vKod')->on('users');

            $table->string('csKod', 4);
            $table->foreign('csKod')->references('csKod')->on('packages');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
