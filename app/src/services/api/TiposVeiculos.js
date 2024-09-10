import { isUndefined } from "lodash";
import api from "../AxiosConfig";

export const create = async (request) => {

    const response = await api.post("/tipo-veiculos", request);
    return response.data;
};

export const edit = async (id, request) => {

    const response = await api.put(`/tipo-veiculos/${id}`, request);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/tipo-veiculos/${id}`);
    return response.data;
};

export const findAll = async (page, tipo, data_inicial, data_final, disable_pagination) => {
    const response = await api.get(`/tipo-veiculos?`, {
        params: {
            page: page,
            tipo: tipo,
            data_inicial: data_inicial,
            data_final: data_final,
            disable_pagination: isUndefined(disable_pagination) ? true : disable_pagination
        },
    });

    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/tipo-veiculos/${id}`);
    return response.data;
};
