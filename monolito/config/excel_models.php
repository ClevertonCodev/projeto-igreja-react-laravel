<?php

return [
    'Estacas' => [
        'fields' => [
            'nome'       => 'Nome',
            'endereco'   => 'Endereço',
            'created_at' => 'Data de Criação'
        ],
        'query' => function ($query, $model){
           return \App\Repositories\EstacasRepository::findAllPagination($query, $model, true);
        }
    ],
    'Alas' => [
        'fields' => [
            'nome'        => 'Nome',
            'endereco'    => 'Endereço',
            'estaca_nome' => 'Estaca',
            'created_at'  => 'Data de Criação'
        ],

        'query' => function ($query) {
            $repository = app(\App\Repositories\AlasRepository::class);
            return $repository->findAllPagination($query, true);
        }
    ],
    'TipoVeiculos' => [
        'fields' => [
            'tipo'        => 'Tipo',
            'created_at'  => 'Data de Criação'
        ],

        'query' => function ($query, $model) {
            return \App\Repositories\TipoVeiculosRepository::findAllPagination($query, $model, true);
        }
    ],
    'Veiculos' => [
        'fields' => [
            'nome'               => 'Nome',
            'quantidade_lugares' => 'Quantidade de Lugares',
            'tipo_veiculo_nome'  => 'Tipo do Veiculo',
            'caravana_nome'      => 'Caravana',
            'created_at'         => 'Data de Criação'
        ],

        'query' => function ($query) {
            $repository = app(\App\Repositories\VeiculosRepository::class);
           return $repository->findAllPagination($query, true);
        }
    ],

];
