<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('items', 'kategoria')) {
            Schema::table('items', function (Blueprint $table) {
                $table->string('kategoria', 100)->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('items', 'kategoria')) {
            Schema::table('items', function (Blueprint $table) {
                $table->dropColumn('kategoria');
            });
        }
    }
};
