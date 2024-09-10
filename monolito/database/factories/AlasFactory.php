<?php

namespace Database\Factories;

use App\Models\Estacas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alas>
 */
class AlasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'nome' => fake()->name(),
           'endereco' => fake()->address(),
           'estaca_id' => function () {
            // Retorna um ID de uma Estaca existente aleatoriamente
            return Estacas::inRandomOrder()->first()->id;
        },
        ];
    }
}
