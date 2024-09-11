<?php

namespace App\Repositories;

use App\Models\Veiculos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class VeiculosRepository extends Repository
{
    protected function setModel(): string
    {
        return Veiculos::class;
    }

    public function findAllPagination(array $params, bool $excel = false): Collection|LengthAwarePaginator
    {
        $model = $this->model::query();

        if (isset($params['nome'])) {
            $model->where('veiculos.nome', 'like', '%' . $params['nome'] . '%');
        }

        if (isset($params['quantidade_lugares'])) {
            $model->where('veiculos.quantidade_lugares', 'like', '%' . $params['quantidade_lugares'] . '%');
        }

        if (isset($params['data_inicial']) && isset($params['data_final'])) {
            $initialDate = Carbon::parse($params['data_inicial'])->startOfDay()->utc();
            $finalDate   = Carbon::parse($params['data_final'])->endOfDay()->utc();

            $model->whereBetween('veiculos.created_at', [$initialDate, $finalDate]);
        }

        $model->join('tipo_veiculos', 'veiculos.tipo_veiculo_id', '=', 'tipo_veiculos.id')
        ->leftJoin('caravanas_veiculos', 'veiculos.id', '=', 'caravanas_veiculos.veiculo_id')
        ->leftJoin('caravanas', 'caravanas.id', '=', 'caravanas_veiculos.caravana_id')
        ->select(
        'veiculos.id as veiculo_id',
        'veiculos.nome',
        'veiculos.created_at',
        'veiculos.tipo_veiculo_id',
        'tipo_veiculos.tipo as tipo_veiculo_nome',
        'veiculos.quantidade_lugares',
        'caravanas_veiculos.id as caravana_veiculo_id',
        'caravanas.id as caravana_id',
        'caravanas.nome as caravana_nome',
        )
        ->distinct();

        if (isset($params['tipo_veiculo_id'])) {
            $model->where('tipo_veiculos.id', 'like', '%' . $params['tipo_veiculo_id'] . '%');
        }

        if (isset($params['caravanas_id'])) {
            $model->where('caravanas.id', 'like', '%' . $params['caravanas_id'] . '%');
        }

        $model->orderBy('nome', 'asc');

        if($excel || filter_var($params['disable_pagination'], FILTER_VALIDATE_BOOLEAN)) {
            return $model->get();
        }

      return $model->paginate(10);

    }

    public function findById(int $id): ?Model
    {
        $model = parent::findById($id);
        $model->load('tipoVeiculos');

        return $model;
    }

    /**
    * Esta função remove o(s) veículo(s) das caravana(s).
    * @param int $id       ID do veículo
    * @param int|null $idCaravan  ID da caravana (opcional)
    * @return bool Retorna true se a remoção for bem-sucedida, false caso contrário.
    * @throws \Exception Se ocorrer um erro durante a remoção.
    */
    public function removeCaravanToVehicle(int $id, int $idCaravan = null): ?bool
    {
         $vehicle = $this->findById($id);
         $remove  = null;

        if(empty($vehicle->caravanas())){
            throw new \Exception('Este veículo não é associado a caravana(s)', 404);
        }

        if(!empty($idCaravan)){
            $remove = $vehicle->caravanas()->detach($idCaravan);
        }else{
             $remove = $vehicle->caravanas()->detach();
        }

        return $remove;
    }
}
