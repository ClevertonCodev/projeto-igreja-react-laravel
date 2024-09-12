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
        Schema::create('caravanas', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('destino', 255);
            $table->integer('quantidade_passageiros');
            $table->dateTime('data_hora_partida');
            $table->dateTime('data_hora_retorno');
            $table->boolean('status')->default(true);
            $table->unsignedBigInteger('estaca_id');
            $table->foreign('estaca_id')->references('id')->on('estacas');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caravanas');
    }
};
