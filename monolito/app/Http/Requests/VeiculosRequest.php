<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VeiculosRequest extends FormRequest
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
            'tipo_veiculo_id'    => 'required',
            'nome'               => 'required',
            'quantidade_lugares' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required'                 => 'O campo nome é obrigatório',
            'tipo_veiculo_id.required'      => 'O campo tipo do veiculo é obrigatório',
            'quantidade_lugares.required'   => 'O campo quantidade de lugares é obrigatório'
        ];
    }
}
