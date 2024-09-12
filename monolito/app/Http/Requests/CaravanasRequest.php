<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CaravanasRequest extends FormRequest
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
        $method = $this->method();

        return [
            'nome'                   => Rule::requiredIf($method != "PATCH"),
            'destino'                => Rule::requiredIf($method != "PATCH"),
            'quantidade_passageiros' => Rule::requiredIf($method != "PATCH"),
            'data_hora_partida'      => Rule::requiredIf($method != "PATCH"),
            'data_hora_retorno'      => Rule::requiredIf($method != "PATCH"),
            'status'                 => Rule::requiredIf($method != "PATCH"),
            'estaca_id'              => Rule::requiredIf($method != "PATCH")
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required'                   => 'O campo nome é obrigatório',
            'destino.required'                => 'O campo destino é obrigatório',
            'quantidade_passageiros.required' => 'O campo quantidade de passageiros é obrigatório',
            'data_hora_partida.required'      => 'O campo data hora partida é obrigatório',
            'data_hora_retorno.required'      => 'O campo data hora retorno é obrigatório',
            'status.required'                 => 'O campo status é obrigatório',
            'estaca_id.required'              => 'O campo Estaca é obrigatório',
        ];
    }
}
