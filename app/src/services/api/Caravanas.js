import { isUndefined } from "lodash";
import api from "../AxiosConfig";

export const create = async (request) => {
    const response = await api.post("/caravanas", request);
    return response.data;
};

export const edit = async (id, request) => {

    const response = await api.put(`/caravanas/${id}`, request);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/caravanas/${id}`);
    return response.data;
};

export const findAll = async (
    page,
    nome,
    quantidadePassageiros,
    status,
    destino,
    estacaId,
    data_inicial,
    data_final,
    disable_pagination
) => {

    const response = await api.get(`/caravanas?`, {
        params: {
            page: page,
            nome: nome,
            quantidade_passageiros: quantidadePassageiros,
            status: status,
            destino: destino ? 1 : 0,
            estaca_id: estacaId,
            data_inicial: data_inicial,
            data_final: data_final,
            disable_pagination: isUndefined(disable_pagination) ? true : disable_pagination
        },
    });
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/delete/veiculos-caravana/${id}`);
    return response.data;
};

export const getVehiclesOfCaravan = async (id) => {
    const response = await api.get(`/caravanas-veiculos/caravana/${id}`);
    return response.data;
};

export const getfreeVehicles = async (id) => {
    const response = await api.get(`caravana/${id}/veiculos-livres`);
    return response.data;
};