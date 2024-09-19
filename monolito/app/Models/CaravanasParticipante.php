<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class CaravanasParticipante extends Model
{
    use HasFactory;

    protected $fillable = ['caravana_id', 'user_id', 'funcao', 'status', 'data_confirmacao'];

    public function rules(){
        return [
            'caravana_id' => 'required',
            'user_id' => 'required|exists:users,id',        
            'funcao' => 'required',
            'status' => 'required',                  
            'data_confirmacao' => 'required|date',
        ];
    }

    public function feedback(){
        return [
            'caravana_id.required' => 'A caravana é obrigatória.',
            'user_id.required' => 'O usuário é obrigatório.',
            'user_id.exists' => 'O usuário selecionado não é válido.',
            'funcao.required' => 'A função é obrigatória.',
            'status.required' => 'O status é obrigatório.',
            'data_confirmacao.required' => 'A data de confirmação é obrigatória.',
        ];
    }
}