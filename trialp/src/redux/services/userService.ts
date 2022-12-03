import axios from "axios";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const API_URL = "https://localhost:7003/api/identity/auth/";

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

const register = (data: RegisterDTO) => {
    return axios.post(API_URL + "register", data);
};

const login = (data: LoginDTO) => {
    return axios
        .post(API_URL + "login", data)
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    register,
    login,
    logout,
};

export default authService;