<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CaravanasParticipantesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'caravana_id' => 'required',
            'user_id' => [
            'required',
            Rule::unique('caravanas_participantes')->where(function ($query) {
                return $query->where('caravana_id', $this->caravana_id);
            }),
            'veiculo_id' => 'required'
        ],        
            'funcao' => 'required',           
        ];
    }

    public function messages(): array
    {
        return [
            'caravana_id.required' => 'A caravana é obrigatória.',
            'user_id.required' => 'O usuário é obrigatório.',
            'user_id.unique' => 'Esse usuário já está registrado nesta caravana.',
            'veiculo_id' => 'O veiculo é obrigatório.',
            'funcao.required' => 'A função é obrigatória.',
        ];
    }
}