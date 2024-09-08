<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        $method = $this->method();
            if($method == "PATCH") {
                return ['password'=>'required'];
            }

            return [
                'nome'     => 'required',
                'email'    => ['required', 'email', Rule::unique('users')->ignore($this->id)],
                'rg'       => 'required',
                'cpf'      => ['required', Rule::unique('users')->ignore($this->id)],
                'telefone' => 'required',
                'endereco' => 'required',
                'password' => Rule::requiredIf($method == "POST"),
                'tipo'     => Rule::requiredIf($method == "PUT")
            ];

    }

    public function messages(): array
    {
        return [
            'required'    => 'O campo :attribute é o obrigatório.',
            'email'       => 'O campo e-mail deve ser um endereço válido.',
            'email.unique'=> 'E-mail já cadastrado no sistema.',
            'cpf.unique'  => 'CPF já cadastrado no sistema.',
        ];
    }
}