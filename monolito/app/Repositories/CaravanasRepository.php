<?php

namespace App\Repositories;

use App\Models\Caravanas;
use App\Models\CaravanasVeiculos;
use App\Models\Veiculos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CaravanasRepository extends Repository
{
    protected function setModel(): string
    {
        return Caravanas::class;
    }

    /**
     * Encontra todos os registros e monta uma paginação com base nos parâmetros fornecidos.
     *
     * @param array $params Array de parâmetros para filtrar os registros
     * @param bool $excel Flag para determinar se o resultado deve estar em formato Excel
     * @return Collection|LengthAwarePaginator Uma coleção de registros ou um resultado paginado
     */
    public function findAllPagination(array $params, bool $excel = false): Collection|LengthAwarePaginator
    {
        $query = $this->model::with(['estacas', 'veiculos.tipoVeiculos']);
        Log::error('Exception', ['exception' => $params['status']]);
        $conditions = [
            'nome' => fn ($query, $value) => $query->where('nome', 'like', "%$value%"),
            'quantidade_passageiros' => fn ($query, $value) => $query->where('quantidade_passageiros', 'like', "%$value%"),
            'status' => fn ($query, $value) => $query->where('status', 'like', "%$value%"),
            'destino' => fn ($query, $value) => $query->where('destino', 'like', "%$value%"),
            'estaca_id' => fn ($query, $value) => $query->where('estaca_id', 'like', "%$value%"),
            'veiculo_id' => function ($query, $value) {
                $query->whereHas('veiculos', fn ($query) => $query->where('veiculos.id', $value));
            },
            'data_inicial' => function ($query) use ($params) {
                $initialDate = Carbon::parse($params['data_inicial'])->startOfDay();
                $query->whereDate('data_hora_partida', '=', $initialDate);
            },
            'data_final' => function ($query) use ($params) {
                $finalDate = Carbon::parse($params['data_final'])->endOfDay();
                $query->whereDate('data_hora_retorno', '=', $finalDate);
            },

        ];
        
        foreach ($params as $param => $value) {
    
            if (!empty($value) && array_key_exists($param, $conditions)) {
                call_user_func($conditions[$param],$query, $value);
            }
        }

        $query->orderBy('nome', 'asc');

        if ($excel || !empty($params['disable_pagination']) &&  filter_var($params['disable_pagination'], FILTER_VALIDATE_BOOLEAN)) {
            return  $query->get();
        }

        return $query->paginate(10);
    }

    /**
     * Encontra e carrega as relações para um caravana específico.
     *
     * @param int $id O ID a ser pesquisado.
     * @param bool|null $allRelationships Se deve carregar todas as relações ou não.
     * @return Collection|Model O caravan carregado com ou sem relações.
     */
    public function findByIdRelations(int $id, ?bool $allRelationships = false): Collection|Model
    {
        $caravan = $this->findById($id);

        if ($allRelationships) {
            $caravan->load([
                'estacas',
                'veiculos.tipoVeiculos',
            ]);

            return $caravan;
        }

        $caravan->load('estacas');

        return $caravan;
    }
    /**
     * Verifica se as caravanas têm veículos disponíveis.
     *
     * @param int $id O ID da caravana a ser verificada.
     * @return array Array de veículos disponíveis.
     */
    public function caravansHaveFreeVehicles(int $id): array
    {

        $caravan = $this->findById($id, true);
        $dateTimeMatch = $caravan->data_hora_partida;
        $dateTimeReturn = $caravan->data_hora_retorno;
        $vehicles = Veiculos::all();

        $vehiclesAvailable = [];

        foreach ($vehicles as $vehicle) {

            $caravanVehicles = CaravanasVeiculos::where('veiculo_id', $vehicle->id)->get();

            $caravansValid = [];

            foreach ($caravanVehicles as $cv) {

                $caravan = $this->findById($cv->caravana_id);

                if (
                    $caravan &&
                    (boolval($caravan->status)) &&
                    $caravan->data_hora_partida <= $dateTimeReturn &&
                    $caravan->data_hora_retorno >= $dateTimeMatch
                ) {
                    $caravansValid[] = $caravan;
                }
            }
            if (count($caravansValid) == 0) {
                $vehiclesAvailable[] = $vehicle;
            }
        }

        return $vehiclesAvailable;
    }

    /**
     * Adiciona veículos a uma caravana e verifica conflitos.
     *
     * @param int $id o ID da caravana
     * @param string|null $vehicles a lista de veículos a serem adicionados
     * @throws \LogicException Veiculo não processável com código 422
     * @throws \LogicException Um ou mais veículos estão em uso durante o mesmo intervalo de tempo com código 404
     * @throws \LogicException Algo deu errado verifique a disponibilidade dos veículos e tente novamente com código 404
     * @return bool
     */
    public function addVehiclesCaravan(int $id, ?string $vehicles): bool
    {
        if (empty($vehicles)) {
            throw new \LogicException('Veiculo não processável', 422);
        }

        $caravan = $this->findById($id);
        $vehicles = explode(',', $vehicles);
        $conflicts = collect();
        $registerVehicle   = [];

        foreach ($vehicles as $vehicleId) {

            $vehicle = Veiculos::find($vehicleId);

            if (empty($vehicle)) {
                continue;
            }

            $caravansConflicts = $vehicle->caravanas()
                ->where('data_hora_retorno', '>', $caravan->data_hora_partida)
                ->where('data_hora_partida', '<', $caravan->data_hora_retorno)
                ->get();

            if ($caravansConflicts->isNotEmpty()) {
                $conflicts = $conflicts->merge($caravansConflicts);
            }

            $registerVehicle = $vehicle;
        }

        if ($conflicts->count() > 0) {
            throw new \LogicException('Um ou mais veículos estão em uso durante o mesmo intervalo de tempo', 404);
        }

        $caravan->veiculos()->attach($registerVehicle);
        $vehiclesCaravan  = $caravan->load('veiculos')->toArray();

        foreach ($vehicles as $vehicleId) {
            foreach ($vehiclesCaravan['veiculos'] as $vehicle) {
                if ($vehicle['id'] == $vehicleId) {
                    return true;
                    break;
                }
            }
        }

        throw new \LogicException("Algo deu errado verifique a disponibilidade dos's' veiculo's' e tente novamente", 404);
    }
    /**
     * Deleta os veículos de uma caravana pelo seu ID.
     *
     * @param int $id O ID da caravana
     * @return bool
     */
    public function deleteVehiclesOfCaravanById(int $id): bool
    {
        $caravan = $this->findByIdRelations($id, true);
        if ($caravan->veiculos->isEmpty()) {
            return $caravan->delete();
        }
        $caravan->veiculos()->detach();
        return $caravan->delete();
    }
}