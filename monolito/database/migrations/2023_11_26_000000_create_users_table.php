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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('rg', 20);
            $table->string('cpf', 14)->unique();
            $table->string('telefone', 20);
            $table->text('endereco');
            $table->boolean('ativo')->default(true);
            $table->enum('tipo', ['comum', 'secretario', 'admin'])->default('comum');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->unsignedBigInteger('ala_id')->nullable();
            $table->foreign('ala_id')->references('id')->on('alas');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
