<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\VeiculosRequest;
use App\Repositories\VeiculosRepository;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;


class VeiculosController extends Controller
{
    private $vehiclesRepository;

    public function __construct(VeiculosRepository $vehiclesRepository)
    {
        $this->vehiclesRepository = $vehiclesRepository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $vehicles =  $this->vehiclesRepository->findAllPagination($request->query());
            return response()->json(['veiculos' => $vehicles], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\VeiculosRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(VeiculosRequest $request)
    {
        try {
            $vehicle =  $this->vehiclesRepository->create($request->all());
            return response()->json(['success' =>  $vehicle], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $vehicle =  $this->vehiclesRepository->findById($id);
            return response()->json(['veiculo' => $vehicle], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  $id veiculo
     * @param  $Idcaravan ID da caravana
     * @return \Illuminate\Http\Response
     */
    public function removeCaravans($id, $Idcaravan)
    {
        try {
            $detachResult = $this->vehiclesRepository->removeCaravanToVehicle($id, $Idcaravan);

            if($detachResult){
                return response()->json(['success' => 'O veiculo foi removido da caravana com sucesso!'], Response::HTTP_OK);
            }

            return response()->json(['error' => 'algo deu errado!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }catch (\Exception $e){
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Http\Requests\VeiculosRequest  $request
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function update(VeiculosRequest $request, $id)
    {
        try {
            $vehicle =  $this->vehiclesRepository->update($id, $request->all());
            return response()->json(['success' =>  $vehicle], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->vehiclesRepository->removeCaravanToVehicle($id);
            $this->vehiclesRepository->delete($id);
             return response()->json(['success' => 'Veiculo deletado com sucesso'], Response::HTTP_OK);
         } catch (\Exception $e) {
             $code = intval($e->getCode());
             return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
         }
    }
}