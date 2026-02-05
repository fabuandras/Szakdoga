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
        Schema::create('card_details', function (Blueprint $table) {
            $table->id();

            $table->tinyInteger('kartya_szam');
            $table->tinyInteger('lejarati_datum');
            $table->tinyInteger('biz_kod');
            $table->string('kartya_nev', 50);
            $table->tinyInteger('kartyaID');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_details');
    }
};
