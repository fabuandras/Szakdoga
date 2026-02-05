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
        Schema::create('home_deliveries', function (Blueprint $table) {
            $table->id();

            $table->string('orszag', 30);
            $table->string('helyseg', 50);
            $table->tinyInteger('hazszam');
            $table->tinyInteger('iranyito_szam');
            $table->string('varos', 30);
            $table->tinyInteger('cimID');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_deliveries');
    }
};
