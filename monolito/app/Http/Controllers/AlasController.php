<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlasRequest;
use App\Repositories\AlasRepository;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class AlasController extends Controller
{
    private $alasRepository;

    public function __construct(AlasRepository $alasRepository)
    {
        $this->alasRepository = $alasRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // dd($request->query());
            $alas = $this->alasRepository->findAllPagination($request->query());
            return  response()->json(['alas' => $alas], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AlasRequest $request)
    {
        try {
            $ala =  $this->alasRepository->create($request->all());
            return response()->json(['success' =>  $ala], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $ala =  $this->alasRepository->findById($id);
            return response()->json(['ala' => $ala], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AlasRequest $request, $id)
    {
        try {
            $ala = $this->alasRepository->update($id, $request->all());
            return response()->json(['success' => $ala], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
           $this->alasRepository->delete($id);
            return response()->json(['success' => 'Ala deletada com sucesso'], Response::HTTP_OK);
        } catch (\Exception $e) {
            $code = intval($e->getCode());
            return response()->json(['error' => $e->getMessage()], $code ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}