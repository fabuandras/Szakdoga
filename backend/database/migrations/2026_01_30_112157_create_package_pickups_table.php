<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('package_pickups', function (Blueprint $table) {
            $table->id();

            $table->tinyInteger('csomagatvetelID');
            $table->string('atveteli_pont', 60);
            $table->string('szallitasi_ceg', 60);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_pickups');
    }
};