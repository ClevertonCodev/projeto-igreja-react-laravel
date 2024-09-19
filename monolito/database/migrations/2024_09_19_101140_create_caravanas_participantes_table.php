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
        Schema::create('caravanas_participantes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('caravana_id'); 
            $table->unsignedBigInteger('user_id'); 
            $table->enum('funcao', ['passageiro', 'organizador']); 
            $table->boolean('status')->default(true); 
            $table->timestamp('data_confirmacao')->nullable(); 
            $table->timestamps();
            $table->foreign('caravana_id')->references('id')->on('caravanas')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caravanas_participantes');
    }
};