<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class EstacasRepository
{
    public static function findAllPagination(array $params, object $model, bool $excel = false): Collection|LengthAwarePaginator
    {
        $model = $model->query();

        if (isset($params['nome'])) {
            $model->where('nome', 'like', '%' . $params['nome'] . '%');
        }

        if (isset($params['endereco'])) {
            $address = str_replace(' ', '%', $params['endereco']);
            $model->where('endereco', 'like', '%' . $address . '%');
        }

        if (isset($params['data_inicial']) && isset($params['data_final'])) {
            $initialDate = Carbon::parse($params['data_inicial'])->startOfDay()->utc();
            $finalDate   = Carbon::parse($params['data_final'])->endOfDay()->utc();

            $model->whereBetween('created_at', [$initialDate, $finalDate]);
        }

        $model->orderBy('nome', 'asc');

        if($excel || filter_var($params['disable_pagination'], FILTER_VALIDATE_BOOLEAN)) {
            return $model->get();
        }

        return $model->paginate(10);
    }
}
