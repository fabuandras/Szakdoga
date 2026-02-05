<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_details', function (Blueprint $table) {

            $table->tinyInteger('kartyaID')->primary();

            $table->tinyInteger('kartya_szam');
            $table->tinyInteger('lejarati_datum');
            $table->tinyInteger('biz_kod');
            $table->string('kartya_nev', 50);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_details');
    }
};
