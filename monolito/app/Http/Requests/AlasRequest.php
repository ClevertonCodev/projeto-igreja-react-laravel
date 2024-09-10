<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AlasRequest extends FormRequest
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
            'nome'      => Rule::requiredIf($method != "PATCH"),
            'endereco'  => Rule::requiredIf($method != "PATCH"),
            'estaca_id' => Rule::requiredIf($method != "PATCH")
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required'      => 'O campo nome é obrigatório',
            'endereco.required'  => 'O campo endereço é obrigatório',
            'estaca_id.required' => 'O campo estaca é obrigatório'
        ];
    }
}
