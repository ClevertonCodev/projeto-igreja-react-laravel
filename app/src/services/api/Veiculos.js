import { isUndefined } from "lodash";
import api from "../AxiosConfig";

export const create = async (request) => {
    const response = await api.post("/veiculos", request);
    return response.data;
};

export const edit = async (id, request) => {

    const response = await api.put(`/veiculos/${id}`, request);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
};

export const findAll = async (
    page,
    nome,
    quantidadeLugares,
    tipo_veiculo_id,
    caravanas_id,
    data_inicial,
    data_final,
    disable_pagination
) => {

    const response = await api.get(`/veiculos?`, {
        params: {
            page: page,
            nome: nome,
            quantidade_lugares: quantidadeLugares,
            tipo_veiculo_id: tipo_veiculo_id,
            caravanas_id: caravanas_id,
            data_inicial: data_inicial,
            data_final: data_final,
            disable_pagination: isUndefined(disable_pagination) ? true : disable_pagination
        },
    });
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/veiculos/${id}`);
    return response.data;
};
