<?php

namespace App\Http\Controllers;

use App\Exports\DataExport;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

/**
 * @OA\Info(title="Login API", version="0.0.1")
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     in="header",
 *     name="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */


class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function exportExecel(Request $request)
    {   
        $modelName =  $request->query('model');
        $data      = config('excel_models.' . $modelName);
        $model     = app("App\\Models\\" . $modelName);
        $query     = call_user_func($data['query'],$request->query(), $model);
        $result    = $this->mapResults($query, $data['fields']);
        Log::info('Gerando arquivo Excel', [
            'data' => collect($result),
            'fields' => $data['fields'],
            'filename' => $modelName . '.xlsx'
        ]);
        return Excel::download(new DataExport(collect($result), $data['fields']), $modelName . '.xlsx');
    }

    private function mapResults($results, $fields)
    {
        return $results->map(function ($item) use ($fields) {
            $mappedItem = [];
            foreach ($fields as $key => $label) {
                $mappedItem[$label] = $item->$key;
            }
            return $mappedItem;
        });
    }
}