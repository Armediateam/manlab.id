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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->integer('no');
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->enum('manual_auto', ['Auto', 'Manual']);
            $table->enum('format_type', ['Greeting', 'Quotation', 'Others']);
            $table->string('name');
            $table->string('nick')->nullable();
            $table->string('company_name')->nullable();
            $table->string('mail')->nullable();
            $table->string('message_subject');
            $table->string('request_date_time');
            $table->enum('result', ['Send Mail Successed', 'Send Mail Fail']);
            $table->string('send_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
