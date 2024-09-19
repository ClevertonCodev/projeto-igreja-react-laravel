<?php

namespace App\Http\Controllers;

use App\Http\Requests\CaravanasRequest;
use App\Repositories\CaravanasRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CaravanasController extends Controller
{
    private $caravansRepository;

    public function __construct(CaravanasRepository $caravansRepository)
    {
        $this->caravansRepository = $caravansRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $caravans = $this->caravansRepository->findAllPagination($request->query());
            return response()->json(['caravanas' => $caravans], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(CaravanasRequest $request)
    {
        try {
            $caravan = $this->caravansRepository->create($request->all());
            return response()->json(['success' => $caravan], Response::HTTP_CREATED);
        } catch (\LogicException $e) {
            Log::error('LogicException: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            
            Log::error('Exception: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function addVehiclesCaravan(Request $request, $id)
    {
        try {
            $caravan = $this->caravansRepository->addVehiclesCaravan($id, $request->veiculos);
            return response()->json(['success' => $caravan], Response::HTTP_OK);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $caravan = $this->caravansRepository->findByIdRelations($id);
            return response()->json(['caravana' => $caravan], Response::HTTP_OK);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function freeVehicles($id)
    {
        try {
            $vehiclesAvailable = $this->caravansRepository->caravansHaveFreeVehicles($id);
            return response()->json(['veiculos_livres' => $vehiclesAvailable], Response::HTTP_OK);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getVehiclesOfCaravan($id)
    {
        try {
            $vehiclesOfCaravan = $this->caravansRepository->findByIdRelations($id, true);
            return response()->json(['caravanas_veiculos' => $vehiclesOfCaravan], Response::HTTP_OK);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(CaravanasRequest $request, $id)
    {
        try {
            $caravan = $this->caravansRepository->update($id, $request->all());
            return response()->json(['success' => $caravan], Response::HTTP_OK);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()],  $e->getCode());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyVehiclesOfCaravan($id)
    {
        try {
            $deleted = $this->caravansRepository->deleteVehiclesOfCaravanById($id);
            if (!empty($deleted)) {
                return response()->json(['success' => 'Caravana deletada com sucesso'], Response::HTTP_CREATED);
            }
            return response()->json(['error' => 'algo deu errado, tente novamente'], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}