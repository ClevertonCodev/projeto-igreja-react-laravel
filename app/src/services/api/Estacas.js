import { isUndefined } from "lodash";
import api from "../AxiosConfig";

export const create = async (request) => {

    const response = await api.post("/estacas", request);
    return response.data;
};

export const edit = async (id, request) => {
    const data = {
        nome: request.name,
        endereco: request.address
    }
    const response = await api.put(`/estacas/${id}`, data);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/estacas/${id}`);
    return response.data;
};

export const findAll = async (page, nome, endereco, data_inicial, data_final, disable_pagination) => {
    const response = await api.get(`/estacas?`, {
        params: {
            page: page,
            nome: nome,
            endereco: endereco,
            data_inicial: data_inicial,
            data_final: data_final,
            disable_pagination: isUndefined(disable_pagination) ? true : disable_pagination
        },
    });
    return response.data;
};

export const destroy = async (id) => {
    const response = await api.delete(`/estacas/${id}`);
    return response.data;
};
