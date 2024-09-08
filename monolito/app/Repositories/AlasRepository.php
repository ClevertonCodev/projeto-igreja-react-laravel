<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Alas;
use Carbon\Carbon;

class AlasRepository extends Repository
{
    protected function setModel(): string
    {
        return Alas::class;
    }

    public function findAllPagination(
        array $params,
        bool $excel = false
        ): Collection|LengthAwarePaginator
    {
        $model = $this->model::query();

        if (isset($params['nome'])) {
            $model->where('alas.nome', 'like', '%' . $params['nome'] . '%');
        }

        if (isset($params['endereco'])) {
            $model->where('alas.endereco', 'like', '%' . $params['endereco'] . '%');
        }

        if (isset($params['data_inicial']) && isset($params['data_final'])) {
            $initialDate = Carbon::parse($params['data_inicial'])->startOfDay()->utc();
            $finalDate   = Carbon::parse($params['data_final'])->endOfDay()->utc();

            $model->whereBetween('alas.created_at', [$initialDate, $finalDate]);
        }

        $model->join('estacas', 'alas.estaca_id', '=', 'estacas.id')
        ->select(
            'alas.id as ala_id',
            'alas.nome',
            'alas.endereco',
            'alas.created_at',
            'alas.estaca_id',
            'estacas.nome as estaca_nome')
        ->get();


        if (isset($params['estaca_id'])) {
            $model->where('estacas.id', 'like', '%' . $params['estaca_id'] . '%');
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
        $model->load('estacas');

        return $model;
    }
}