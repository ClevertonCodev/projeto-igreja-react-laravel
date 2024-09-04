<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estacas extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'endereco'];

    public function rules(){
        return [
        'nome' => 'required',
        'endereco' => 'required'];

    }

    public function feedback(){
        return [
            'required'=> 'O campo :attribute é obrigatório',
        ];
    }

    public function alas()
    {
        return $this->hasMany(Alas::class);
    }

    public function caravanas()
    {
        return $this->hasMany(Caravanas::class);
    }
}
