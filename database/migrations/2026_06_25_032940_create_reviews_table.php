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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->string('name');
            $table->string('nick_or_company')->nullable();
            $table->string('email')->nullable();
            $table->boolean('selected')->default(false);
            $table->boolean('top8')->default(false);
            $table->text('thumbnail_before')->nullable();
            $table->text('thumbnail_after')->nullable();
            $table->string('register_start_date');
            $table->string('register_end_date');
            $table->string('category');
            $table->string('selected_vendor');
            $table->integer('like')->default(0);
            $table->enum('view_status', ['Viewing', 'Hidden'])->default('Hidden');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
