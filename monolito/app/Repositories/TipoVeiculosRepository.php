<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class TipoVeiculosRepository
{
    public static function findAllPagination(array $params, object $model, bool $excel = false): Collection|LengthAwarePaginator
    {
        $model = $model->query();
        if (isset($params['tipo'])) {
            $model->where('tipo', 'like', '%' . $params['tipo'] . '%');
        }

        if (isset($params['data_inicial']) && isset($params['data_final'])) {
            $initialDate = Carbon::parse($params['data_inicial'])->startOfDay()->utc();
            $finalDate   = Carbon::parse($params['data_final'])->endOfDay()->utc();

            $model->whereBetween('created_at', [$initialDate, $finalDate]);
        }

        $model->orderBy('tipo', 'asc');

        if($excel || filter_var($params['disable_pagination'], FILTER_VALIDATE_BOOLEAN)) {
            return $model->get();
        }

        return $model->paginate(10);
    }
}