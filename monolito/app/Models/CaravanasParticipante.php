<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaravanasParticipante extends Model
{
    use HasFactory;

    protected $fillable = ['caravana_id', 'user_id', 'veiculo_id', 'funcao', 'status', 'data_confirmacao'];

    public function caravanas()
    {
        return $this->belongsTo(Caravanas::class, 'caravana_id');
    }
}