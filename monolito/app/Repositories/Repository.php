<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

abstract class Repository
{
    protected  $model;
    /**
     * inicia o repository
     *
     * @param datatype $paramname descrição
     * @throws Some_Exception_Class descrição da exceção
     * @return Some_Return_Value
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Inicializa a função definindo a classe do modelo e criando uma instância dela.
     *
     * @throws \Exception se model {modelClass} não existe.
     * @return void
     * object $this->model instância do modelo
     */
    protected function init(): void
    {
        $modelClass = $this->setModel();

        if (!class_exists($modelClass)) {
            throw new \Exception("esse model {$modelClass} não existe.", 404);
        }

        $this->model = app($modelClass);
    }

    /**
    * Define o modelo para a função Repository.
    *
    * @return string
    */
    abstract protected function setModel(): string;
    /**
     * Encontra todos os modelos com base nos parâmetros fornecidos.
     *
     * @param array $params Um array de parâmetros para filtrar os modelos.
     * @throws \Exception Se nenhum dado for encontrado, uma exceção 404 é lançada.
     * @return Collection|null A coleção de modelos encontrados com base nos parâmetros.
     */
    public function findAll(array $params = []): ?Collection
    {
        if (empty($params)) {
            $model = $this->model::all();
        } else {

            $query = $this->model::query();

            if (isset($params['atributos'])) {
                $attributes = explode(',', $params['atributos']);
                $query->select($attributes);
            }

            if (isset($params['atributos_relacionamento'])) {
                if (method_exists($this->model, $params['model'])) {
                    $relationShips = explode(',', $params['atributos_relacionamento']);
                    $query->with([$params['model'] . ':id,' . implode(',', $relationShips)]);
                }
            }
            $model = $query->get();
            if (isset($params['model']) && empty($params['atributos_relacionamento'])) {
                $model->load($params['model']);
            }

        }
        if ($model->isEmpty()) {
            throw new \Exception('Nenhum dado encontrado', 404);
        }
        return  $model;
    }

    /**
     * Encontra um modelo pelo seu ID.
     *
     * @param int $id O ID do modelo a ser encontrado.
     * @throws \Exception Se nenhum dado for encontrado, uma exceção 404 é lançada.
     * @return Model|null
     */
    public function findById(int $id): ?Model
    {
        $model = $this->model::find($id);
        if (empty($model)) {
            throw new \Exception('Item solicitado não existe', 404);
        }
        return $model;
    }

    /**
     * Cria uma nova instância do modelo e armazena no banco de dados.
     *
     * @param array $attributes
     * @return Model|null
     */
    public function create(array $attributes): ?Model
    {
        return $this->model::create($attributes);
    }

    /**
    * Atualiza um modelo pelo ID com os atributos fornecidos.
    *
    * @param int $id O ID do modelo a ser atualizado
    * @param array $attributes Os atributos a serem atualizados
    * @throws \Exception Erro inesperado 500
    * @return Model|null O modelo atualizado se bem-sucedido, nulo caso contrário
    */
    public function update(int $id, array $attributes = []):?Model
    {
        $model  = $this->findById($id);
        $update = $model->update($attributes);

        if ($update) {
            return $model;
        }

        throw new \Exception('Erro inesperado', 500);
    }


    /**
    * Apaga um modelo pelo ID.
    *
    * @param int $id O ID do modelo a ser apagado
    * @throws \Exception Erro inesperado 500
    * @return bool O resultado da operação
    */
    public function delete(int $id): ?bool
    {

        $model   = $this->findById($id);
        $delete  = $model->delete();

        if ($delete) {
            return $delete;
        }

        throw new \Exception('Erro inesperado', 500);
    }
}
