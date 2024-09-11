<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Veiculos extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_veiculo_id',
        'nome',
        'quantidade_lugares',
    ];

    public function tipoVeiculos() {

        return $this->belongsTo(TipoVeiculos::class, 'tipo_veiculo_id');
    }

    public function caravanas() {
        return $this->belongsToMany(Caravanas::class, CaravanasVeiculos::class, 'veiculo_id', 'caravana_id');
    }

}
