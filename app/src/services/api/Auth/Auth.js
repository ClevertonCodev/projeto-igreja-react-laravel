import axios from "axios";
import getToken from "./GetToken"
import api from "../../AxiosConfig"
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage'
const { extra } = Constants.expoConfig;
const apiUrl = extra.apiUrl;

export const login = async (request) => {

    const response = await axios.post(`${apiUrl}/api/login`, request, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    );

    return response.data
}

export const register = async (request) => {
    const response = await axios.post(`${apiUrl}/api/user/cadastro`, request, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    );

    return response.data
}

export const logout = async (navigation) => {

    try {
        const response = await api.post('/logout');

        if (response.status === 200) {
            await AsyncStorage.removeItem('access_token');
            navigation.navigate('Login');
        }

    } catch (error) {
        await AsyncStorage.removeItem('access_token');
        navigation.navigate('Login');
    } finally {
        if (await getToken()) {
            navigation.navigate('Login');
        }
    }

}
export const me = async () => {

    const response = await api.post('/me');

}

export const validadeEmail = async () => {
    const response = await api.post('/email-verificacao');
    return response.data;
}

export const validadeEmailAndCPF = async (request) => {
    let data = new FormData();
    data.append("email", request.email);
    data.append("cpf", request.cpf);
    const response = await axios.post('http://localhost:8000/api/forgot-password/verificar-dados', data);
    return response.data;
}

export const passwordRecovery = async (email) => {
    let data = new FormData();
    data.append("email", email);
    const response = await axios.post(`${apiUrl}/api/forgot-password/senha-email-recuperacao`, data);
    return response.data;
}

export const passwordResetUpdate = async (request, token) => {
    const data = {
        email: request.email,
        password: request.password,
        password_confirmation: request.confirmePassword,
        token: token
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await axios.put(`${apiUrl}/api/forgot-password/nova-senha`, data, { headers });
    return response.data;
}


