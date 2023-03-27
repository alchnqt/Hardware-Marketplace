import axios from "axios";
import jwt_decode from "jwt-decode";
import { DEFAULT_OCELOT_GATEWAY } from "../../App_Data/configuration";
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


export interface TokenResponse{
    result: string,
    success: boolean
}

const register = (data: RegisterDTO) => {
    return axios.post(API_URL + "register", data);
};

const login = (data: LoginDTO) => {
    return axios
        .post(API_URL + "login", data, { withCredentials: true })
        .then((response) => {
            if (response.data.accessToken !== '' && response.status === 200) {
                var decoded = jwt_decode(response.data.access_token);
                localStorage.setItem("user", JSON.stringify(decoded));
            }
            return response;
        }).catch((err) => {
            return err;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    return axios
        .post(API_URL + "logout", {}, { withCredentials: true });
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