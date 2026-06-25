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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->integer('no');
            $table->string('name');
            $table->string('nick_or_company')->nullable();
            $table->enum('type', ['WA', 'Mail', 'WA/Mail']);
            $table->string('hp_for_wa')->nullable();
            $table->string('mail')->nullable();
            $table->string('request_type')->default('Admin Direct');
            $table->string('request_quotation')->default('0EA');
            $table->string('consulting_reply')->default('0EA');
            $table->string('withdrawal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
