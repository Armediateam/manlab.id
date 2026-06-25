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
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->integer('no');
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->string('name');
            $table->string('nick_or_company')->nullable();
            $table->text('photo_url')->nullable();
            $table->enum('preferred_contact', ['WA', 'Email']);
            $table->enum('route', ['D', 'A']);
            $table->enum('visit', ['N', 'Y']);
            $table->string('visit_date_time')->nullable();
            $table->enum('total_partial', ['Total', 'Partial']);
            $table->string('cate');
            $table->string('budget');
            $table->enum('ownership', ['Owner', 'Tenant']);
            $table->string('building_type');
            $table->string('location');
            $table->text('special_req')->nullable();
            $table->string('request_date');
            $table->enum('reply_quo', ['Replied', 'Not Yet']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
