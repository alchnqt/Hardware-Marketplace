import axios, { AxiosStatic } from "axios";
import { setAccessToken } from "../../Auth/AccessToken";

const API_URL = "http://localhost:8080/api/auth/";

export const register = (username: string, email: string, password: string, repeatPassword: string) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
    repeatPassword
  });
};

export const login = (username: string, password: string) => {
    return axios
        .post(API_URL + "login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                setAccessToken(response.data.accessToken);
            }

            return response.data;
        });
};

export const logout = () => {
    return axios
        .post(API_URL + "logout")
        .then((response) => {
            return response.data;
        });
};