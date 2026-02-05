<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_pickups', function (Blueprint $table) {

            $table->tinyInteger('csomagatvetelID')->primary();

            $table->string('atveteli_pont', 60);
            $table->string('szallitasi_ceg', 60);

            $table->tinyInteger('cimID');
            $table->foreign('cimID')->references('cimID')->on('home_deliveries');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_pickups');
    }
};
