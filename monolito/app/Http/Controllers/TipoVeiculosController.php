<?php

namespace App\Http\Controllers;

use App\Models\TipoVeiculos;
use App\Http\Controllers\Controller;
use App\Repositories\TipoVeiculosRepository;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TipoVeiculosController extends Controller
{
    private $tipoVeiculos;

    public function __construct(TipoVeiculos  $tipoVeiculos)
    {
        $this->tipoVeiculos =  $tipoVeiculos;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $tipoVeiculos = TipoVeiculosRepository::findAllPagination($request->query(), $this->tipoVeiculos);
            return response()->json(['tipo_veiculos' => $tipoVeiculos], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $request->validate($this->tipoVeiculos->rules(), $this->tipoVeiculos->feedback());
            $tipoVeiculos = $this->tipoVeiculos->create($request->all());
            return response()->json(['success' => $tipoVeiculos], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TipoVeiculos  $tipoVeiculo
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        try {
            $tipoVeiculo = $this->tipoVeiculos->find($id);

            if (empty($tipoVeiculo)) {

                return response()->json(
                    ['error' => 'Item solicitado não existe'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return  response()->json(['tipo_veiculo' =>  $tipoVeiculo], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TipoVeiculos  $tipoVeiculo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {
            $tipoVeiculo = $this->tipoVeiculos->find($id);

            if (empty($tipoVeiculo)) {

                return response()->json(
                    ['error' => 'Item solicitado não existe'],
                    Response::HTTP_NOT_FOUND
                );
            }

            $request->validate($tipoVeiculo->rules(), $tipoVeiculo->feedback());
            $update = $tipoVeiculo->update($request->all());

            if ($update) {
                return  response()->json(['success' =>  $tipoVeiculo], Response::HTTP_OK);
            }

            throw new \Exception('Erro inesperado');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TipoVeiculos  $tipoVeiculo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $tipoVeiculo = $this->tipoVeiculos->find($id);

            if (empty($tipoVeiculo)) {
                return response()->json(
                    ['error' => 'Impossível realizar a exclusão. O recurso solicitado não existe'],
                    Response::HTTP_NOT_FOUND
                );
            }

            $tipoVeiculo->delete();

            return response()->json(
                ['success' => 'O tipo do veiculo foi removido com sucesso!'],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}