<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_items', function (Blueprint $table) {
            $table->string('csKod', 4);
            $table->tinyInteger('rendeles_szam');
            $table->tinyInteger('cikk_szam');
            $table->tinyInteger('menny');

            // Composite primary key
            $table->primary(['csKod', 'rendeles_szam', 'cikk_szam']);

            // Foreign keys
            $table->foreign('csKod')
                ->references('csKod')
                ->on('packages')
                ->onDelete('cascade');

            $table->foreign('rendeles_szam')
                ->references('rendeles_szam')
                ->on('orders')
                ->onDelete('cascade');

            $table->foreign('cikk_szam')
                ->references('cikk_szam')
                ->on('items')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_items');
    }
};