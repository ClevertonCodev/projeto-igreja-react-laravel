<?php

namespace App\Http\Controllers;

use App\Models\Estacas;
use App\Repositories\EstacasRepository;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EstacasController extends Controller
{
    private  $estacas;

    public function __construct(Estacas $estacas)
    {
        $this->estacas = $estacas;
    }
    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $estacas = EstacasRepository::findAllPagination($request->query(), $this->estacas);
            return response()->json(['estacas' => $estacas], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error'=> $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $request->validate($this->estacas->rules(), $this->estacas->feedback());
            $estaca = $this->estacas->create($request->all());
            return response()->json(['success' => $estaca], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error'=> $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Estacas  $estacas
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $estaca = $this->estacas->find($id);

            if (empty($estaca)) {

                return response()->json(
                    ['error' => 'Item solicitado não existe'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return  response()->json(['estaca' => $estaca], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error'=> $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {

            $estaca = $this->estacas->find($id);

            if (empty($estaca)) {
                return response()->json(
                    ['erro' => 'O recurso solicitado não existe'],
                    Response::HTTP_NOT_FOUND
                );
            }
            if ($request->method() === 'PATCH') {

                $regrasvalidate = array();

                foreach ($estaca->rules() as $input => $regra) {


                    if (array_key_exists($input, $request->all())) {
                        $regrasvalidate[$input] = $regra;
                    }
                }
                $request->validate($regrasvalidate, $estaca->feedback());
            } else {
                $request->validate($estaca->rules(), $estaca->feedback());
            }

            $update =  $estaca->update($request->all());

            if($update){
                return response()->json(['success' => $estaca], Response::HTTP_OK);
            }

            throw new \Exception('Erro inesperado');

        } catch (\Exception $e) {
            return response()->json(['error'=> $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param  \App\Models\Estacas  $estacas
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {

            $estaca = $this->estacas->find($id);

            if (empty($estaca)) {
                return response()->json(
                    ['error' => 'Impossível realizar a exclusão. O recurso solicitado não existe'], Response::HTTP_NOT_FOUND
                );
            }

            $estaca->delete();
            return response()->json(
                ['success' => 'A estaca foi removida com sucesso!']
                , Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(['error'=> $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
