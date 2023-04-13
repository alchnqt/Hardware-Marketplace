import axios from "axios";
import jwt_decode from "jwt-decode";
import { DEFAULT_OCELOT_GATEWAY } from "../../App_Data/configuration";
import { LoginDto } from "../store/backend/identityServer.api";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const API_URL = `${DEFAULT_OCELOT_GATEWAY}/identity/auth/`;

export interface RegisterDTO {
    username: string,
    email: string,
    password: string,
    repeatPassword: string
}

export interface LoginDTO {
    email: string,
    password: string
}


export interface TokenResponse {
    result: string,
    success: boolean
}

export interface AuthResult {
    message: string,
    result: string,
    access_token: string,
    success: boolean
}

function apiPost<T, P>(url: string, data: P): Promise<T> {
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json() as T;
        })
        .then(data => { /* <-- data inferred as { data: T }*/
            return data
        })
}

const register = async (data: RegisterDTO) => {

    return axios.post(API_URL + "register", data);
};

const login = async (data: LoginDTO) => {
    const res = await apiPost<AuthResult, LoginDto>(`${API_URL}login`, data);
    return res;
    // return axios
    //     .post<AuthResult>(API_URL + "login", data, { withCredentials: true });
};

const logout = () => {
    localStorage.removeItem("user");
    return axios
        .post<AuthResult>(API_URL + "logout", {}, { withCredentials: true });
};

const refreshToken = async () => {
    const rawResponse = await fetch(`${API_URL}refreshtoken`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        method: 'POST'
    });
    const content = await rawResponse.json() as TokenResponse;
    if (content.success) {
        var decoded = jwt_decode(content.result);
        localStorage.setItem("user", JSON.stringify(decoded));
    }
    return content;
}

const authService = {
    register,
    login,
    logout,
    refreshToken
};

export default authService;