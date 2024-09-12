<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class CaravanasVeiculos extends Model
{
    use HasFactory;

    protected $fillable = ['caravana_id', 'veiculo_id'];

    public function rules(){
        return  [
        'veiculo_id' => Rule::unique('caravanas_veiculos')->ignore($this->id)
        ];
    }

    public function feedback(){
        return [
            'veiculo_id.unique' => 'Esse veiculo está em uso',
        ];
    }
}
