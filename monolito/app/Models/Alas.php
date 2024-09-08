<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alas extends Model
{
    use HasFactory;

    protected $fillable = [
     'nome',
     'endereco',
     'estaca_id'
    ];

    public function estacas() {
        return $this->belongsTo(Estacas::class, 'estaca_id');
    }

}
