import { isUndefined } from "lodash";
import api from "../AxiosConfig";

export const create = async (request) => {
    const response = await api.post("/user", request);
    return response.data;
};

export const edit = async (id, request) => {

    const response = await api.put(`/user/${id}`, request);
    return response.data;
};

export const findId = async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
};

export const findAll = async () => {

    const response = await api.get(`/user/listar?`);
    return response.data;
};

