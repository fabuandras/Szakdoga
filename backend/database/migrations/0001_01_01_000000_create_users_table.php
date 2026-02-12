<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {

            $table->id('vKod');

            $table->string('vez_nev', 20);
            $table->string('ker_nev', 20);
            $table->string('jelszo', 60);
            $table->string('email', 40)->unique();
            $table->string('megszolitas', 10);
            $table->tinyInteger('tel_szam');
            $table->date('szul_datum');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
