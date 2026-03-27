<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {

            $table->id('cikk_szam');
            $table->string('elnevezes', 50);
            $table->integer('akt_keszlet')->default(0);
            $table->decimal('egyseg_ar', 10, 2);
            $table->string('kep_url')->nullable();
            $table->string('kartya_hatterszin', 20)->nullable();
            $table->string('kartya_stilus', 50)->nullable();

            // added category column
            $table->string('kategoria')->nullable()->after('elnevezes');

            $table->timestamps();
        });

        // Populate kategoria based on elnevezes heuristics for existing/test data
        try {
            DB::table('items')->update(['kategoria' => DB::raw("CASE
                WHEN LOWER(elnevezes) LIKE '%fonal%' THEN 'Fonalak'
                WHEN LOWER(elnevezes) LIKE '%horgol%' THEN 'Horgolóminták'
                WHEN LOWER(elnevezes) LIKE '%pluss%' OR LOWER(elnevezes) LIKE '%plüss%' THEN 'Plüssök'
                WHEN LOWER(elnevezes) LIKE '%kit%' OR LOWER(elnevezes) LIKE '%készlet%' OR LOWER(elnevezes) LIKE '%ajandek%' OR LOWER(elnevezes) LIKE '%ajándék%' THEN 'Eszközök'
                ELSE COALESCE(kategoria, 'Egyéb') END")] );
        } catch (\Throwable $e) {
            // ignore if DB not ready or update fails during tests
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
