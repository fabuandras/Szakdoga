<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {

            $table->id('cikk_szam');
            $table->string('elnevezes', 50);
            $table->integer('akt_keszlet');
            $table->decimal('egyseg_ar', 10, 2);
            $table->string('kep_url')->nullable();
            $table->string('kartya_hatterszin', 20)->nullable();
            $table->string('kartya_stilus', 50)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
