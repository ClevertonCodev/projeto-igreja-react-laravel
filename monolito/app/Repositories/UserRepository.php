<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserRepository extends Repository
{
    protected function setModel(): string
    {
        return User::class;
    }

    public function register(object $attributes) : object
    {

        $users = $this->model::all();
        $user  = $this->create([
            'nome'      => $attributes->nome,
            'rg'        => $attributes->rg,
            'cpf'       => $attributes->cpf,
            'telefone'  => $attributes->telefone,
            'endereco'  => $attributes->endereco,
            'tipo'      => $users->isEmpty() ? 'admin' : 'comum',
            'email'     => $attributes->email,
            'password'  => bcrypt($attributes->password)
        ]);

        if (!$user) {
            throw new \Exception('Erro inesperado', 500);
        }

        return $user;
    }

    public function registerAdminAndSecretary(object $attributes)
    {

        $user = $this->create([
            'nome'      => $attributes->nome,
            'rg'        => $attributes->rg,
            'cpf'       => $attributes->cpf,
            'telefone'  => $attributes->telefone,
            'endereco'  => $attributes->endereco,
            'tipo'      => $attributes->tipo,
            'email'     => $attributes->email,
            'password'  => bcrypt($attributes->password)
        ]);

        if (!$user) {
            throw new \Exception('Erro inesperado', 500);
        }

        return $user;
    }

    public function updatePut(int $id, object $attributes)
    {
        $this->log($id, $attributes, 'ATUALIZOU');
        $user = $this->update($id, [
            'nome'      => $attributes->nome,
            'email'     => $attributes->email,
            'cpf'       => $attributes->cpf,
            'telefone'  => $attributes->telefone,
            'endereco'  => $attributes->endereco,
            'tipo'      => $attributes->tipo,
        ]);
        return $user;
    }

    public function updatePatch(int $id, object $attributes)
    {
        $this->log($id, $attributes, 'ATUALIZOU');
        $user = $this->update($id, [
            'password' => bcrypt($attributes->password)
        ]);

        return $user;
    }

    public function userDelete(int $id, object $attributes)
    {
        $this->log($id, $attributes, 'APAGOU');
        $user = $this->findById($id);
        $this->delete($id);
    }

    public function log(int $id, object $attributes, string $message)
    {

        $auth = auth()->user();
        $user = $this->findById($id);
        Log::channel('user')->info("{$auth->type}: {$auth->firstName} cpf: {$auth->cpf} ip: {$attributes->ip()} {$message} informações de {$user->type}: {$user->firstName} {$user->lastName} cpf: {$user->cpf}", [
            'autenticado_metodo'     => $attributes->method(),
            'autenticado_tipo'       => $auth->type,
            'autenticado_nome'       => $auth->firstName,
            'autenticado_id'         => $auth->id,
            'autenticado_cpf'        => $auth->cpf,
            'autenticado_ip'         => $attributes->ip(),
            'usuario_alvo_tipo'      => $user->type,
            'usuario_alvo_nome'      => $user->firstName,
            'usuario_alvo_sobrenome' => $user->lastName,
            'usuario_alvo_cpf'       => $user->cpf,
            'usuario_alvo_id'        => $user->id
        ]);
    }
}
