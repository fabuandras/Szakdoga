<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('type')->nullable(); // notification type or activity type (create, release, delete, etc.)
            $table->text('message')->nullable();

            // activity-related fields
            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('item_name')->nullable();
            $table->integer('quantity')->nullable();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable();

            $table->string('reason')->nullable();
            $table->text('note')->nullable();

            // arbitrary JSON payload if needed
            $table->json('data')->nullable();

            // read flag / timestamp
            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            $table->index('created_at');
            $table->index('item_id');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};