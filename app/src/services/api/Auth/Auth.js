import axios from "axios";
import getToken from "./GetToken"
import api from "../../AxiosConfig"

export const login = async (request) => {

    const response = await axios.post("http://192.168.1.65:8000/api/login", request, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    );

    return response.data
}

export const register = async (request) => {

    const response = await axios.post("http://localhost:8000/api/user/cadastro", request, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    );

    return response.data
}

export const refreshToken = async () => {

    const token = getToken(true);
    try {
        if (token) {
            const response = await axios.post('http://localhost:8000/api/refresh', {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                }
            );

            if (response.status === 200) {
                localStorage.removeItem('access_token');
                localStorage.setItem('access_token', response.data.access_token);
            }
            return response.data.token;

        } else {
            localStorage.removeItem('access_token');
            return window.location.href = '/';
        }
    } catch (error) {
        if (error.response && error.response.status === 500) {
            await logout();
        }
    }
}

export const logout = async () => {

    try {
        const response = await api.post('/logout');

        if (response.status === 200) {
            localStorage.removeItem('access_token');
            return window.location.href = '/';
        }

    } catch (error) {
        localStorage.removeItem('access_token');
        return window.location.href = '/';
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
    const response = await axios.post('http://localhost:8000/api/forgot-password/senha-email-recuperacao', data);
    return response.data;
}

export const passwordResetUpdate = async (request, token) => {
    // console.log(request.email);
    // let data = new FormData();
    // data.append("email", request.email );
    // data.append("password", request.password);
    // data.append("password_confirmation", request.confirmePassword);
    // data.append("token", token);
    // const response = await axios.post('http://localhost:8000/api/forgot-password/nova-senha', data);
    // return response.data;
    const data = {
        email: request.email,
        password: request.password,
        password_confirmation: request.confirmePassword,
        token: token
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await axios.put('http://localhost:8000/api/forgot-password/nova-senha', data, { headers });
    return response.data;
}


