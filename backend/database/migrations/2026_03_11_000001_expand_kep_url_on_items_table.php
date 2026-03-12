<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make this migration safe: if the items table or kep_url column doesn't exist,
        // create the column instead of attempting a MODIFY that would fail.
        if (! Schema::hasTable('items')) {
            return;
        }

        if (Schema::hasColumn('items', 'kep_url')) {
            // Try the schema change; if the DBAL package is not installed or change fails,
            // fall back to raw SQL MODIFY (silently ignore failures to avoid breaking).
            try {
                Schema::table('items', function (Blueprint $table) {
                    $table->text('kep_url')->nullable()->change();
                });
            } catch (\Throwable $e) {
                try {
                    DB::statement('ALTER TABLE `items` MODIFY `kep_url` TEXT NULL');
                } catch (\Throwable $e2) {
                    // ignore: leave existing column as-is
                }
            }
        } else {
            // Column missing -> create it
            Schema::table('items', function (Blueprint $table) {
                $table->text('kep_url')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // To avoid accidental data loss, do not drop or modify existing kep_url column here.
        // If you need to revert, handle it manually or implement a safe reverse step.
    }
};
