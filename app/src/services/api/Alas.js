import api from "../AxiosConfig";
import { isUndefined } from "lodash";

export const create = async (request) => {
    const response = await api.post("/alas", request);
    return response.data;
};

export const edit = async (id, request) => {

    const response = await api.put(`/alas/${id}`, request);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/alas/${id}`);
    return response.data;
};

export const findAll = async (page, nome, endereco, estaca_id, data_inicial, data_final, disable_pagination) => {
    const response = await api.get(`/alas?`, {
        params: {
            page: page,
            nome: nome,
            endereco: endereco,
            estaca_id: estaca_id,
            data_inicial: data_inicial,
            data_final: data_final,
            disable_pagination: isUndefined(disable_pagination) ? true : disable_pagination
        },
    });
    console.log(response.data);
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/alas/${id}`);
    return response.data;
};
