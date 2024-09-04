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
        Schema::create('alas', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 45);
            $table->text('endereco');
            $table->unsignedBigInteger('estaca_id');
            $table->foreign('estaca_id')->references('id')->on('estacas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alas');
    }
};
