<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_pickups', function (Blueprint $table) {

            $table->id('csomagatvetelID');

            $table->string('atveteli_pont', 60);
            $table->string('szallitasi_ceg', 60);

            $table->foreignId('cimID')->references('cimID')->on('home_deliveries');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_pickups');
    }
};
