<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('status', 20)->default('open');
            $table->unsignedBigInteger('started_by')->nullable();
            $table->unsignedBigInteger('closed_by')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventory_id');
            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('item_name')->nullable();
            $table->string('item_sku')->nullable();
            $table->integer('system_quantity')->default(0);
            $table->integer('counted_quantity')->nullable();
            $table->integer('damaged_quantity')->nullable();
            $table->integer('difference')->nullable();
            $table->text('note')->nullable();
            $table->unsignedBigInteger('counted_by')->nullable();
            $table->timestamp('counted_at')->nullable();
            $table->timestamps();

            $table->foreign('inventory_id')->references('id')->on('inventories')->cascadeOnDelete();
            $table->foreign('item_id')->references('cikk_szam')->on('items')->nullOnDelete();

            $table->unique(['inventory_id', 'item_id'], 'inventory_item_unique');
            $table->index('item_id');
            $table->index('counted_at');
        });

        if (Schema::hasTable('notifications') && ! Schema::hasColumn('notifications', 'inventory_id')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->unsignedBigInteger('inventory_id')->nullable()->after('item_id');
                $table->index('inventory_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('notifications') && Schema::hasColumn('notifications', 'inventory_id')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->dropIndex(['inventory_id']);
                $table->dropColumn('inventory_id');
            });
        }

        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('inventories');
    }
};
