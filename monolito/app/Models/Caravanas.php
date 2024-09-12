<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Caravanas extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nome',
        'destino',
        'quantidade_passageiros',
        'data_hora_partida',
        'data_hora_retorno',
        'status',
        'estaca_id'
    ];

    public function estacas()
    {
        return $this->belongsTo(Estacas::class, 'estaca_id');
    }

    public function veiculos()
    {
        return $this->belongsToMany(Veiculos::class, CaravanasVeiculos::class, 'caravana_id', 'veiculo_id');
    }
}
