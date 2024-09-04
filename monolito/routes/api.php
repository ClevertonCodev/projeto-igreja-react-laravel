<?php

use App\Http\Controllers\AlasController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CaravanasController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\EstacasController;
use App\Http\Controllers\TipoVeiculosController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VeiculosController;

Route::post('user/cadastro', [UserController::class, "store"]);
Route::post('login', [AuthController::class, "login"]);
Route::prefix('forgot-password')->middleware('guest')->group(function () {
    Route::post('/verificar-dados', [AuthController::class, "validadeEmailAndCPF"]);
    Route::post('/senha-email-recuperacao', [AuthController::class, "passwordResetEmail"]);
    Route::put('/nova-senha', [AuthController::class, "passwordResetUpdate"]);
});

Route::post('refresh', [AuthController::class, "refresh"]);

Route::prefix('v1')->middleware(['jwt.auth'])->group(function () {
    Route::post('me', [AuthController::class, "me"]);
    Route::get('/export', [Controller::class, "exportExecel"]);
    Route::post('logout', [AuthController::class, "logout"]);
    Route::post('/email-verificacao', [AuthController::class, "verificationEmailSend"]);
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, "verificationEmailVerify"])->name('verification.verify');

    Route::prefix('user')->middleware('verified')->group(function () {
        Route::get('/listar', [UserController::class, "index"]);
        Route::get('/detalhes/{id}', [UserController::class, "show"]);
        Route::put('/atualizar/{id}', [UserController::class, "update"]);
        Route::patch('/atualizar-senha/{id}', [UserController::class, "update"]);
        Route::delete('/remover/{id}', [UserController::class, "destroy"]);
        Route::post('cadastro/admin', [UserController::class, "storeAdminAndSecretary"]);
        Route::patch('/mudar-status/{id}', [UserController::class, 'updateTipo']);
    });


    Route::apiResource('estacas', EstacasController::class);
    Route::apiResource('alas', AlasController::class);
    Route::apiResource('tipo-veiculos', TipoVeiculosController::class);
    Route::apiResource('veiculos', VeiculosController::class);
    Route::delete('veiculos/remove_caravanas_veiculos/{id}/{idCaravana}', [VeiculosController::class, 'RemoveCaravans']);
    Route::apiResource('caravanas', CaravanasController::class);
    Route::post('caravana/{id}/adicionar-veiculos',[CaravanasController::class, "addVehiclesCaravan"]);
    Route::get('caravana/{id}/veiculos-livres',[CaravanasController::class, "freeVehicles"]);
    Route::get('caravanas-veiculos/caravana/{id}', [CaravanasController::class, "getVehiclesOfCaravan"]);
    Route::delete('delete/veiculos-caravana/{id}', [CaravanasController::class, "destroyVehiclesOfCaravan"]);
});