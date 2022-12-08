import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import accessTokenService from '../../../Auth/AccessToken';
export interface AccessToken {
    access_token: string
}
export interface LoginDto {
    email: string,
    password: string
}

export interface RegisterDto {
    email: string,
    password: string,
    repeatPassword: string,
    username: string
    phone: string
}

export const identityApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["auth"]
        }
    ),
    endpoints: build => ({
        login: build.mutation<AccessToken, LoginDto>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: '/login',
            })
        }),
        register: build.mutation<any, RegisterDto>({
            query: (data) => ({
                method: 'POST',
                url: '/register',
                body: data,
            })
        }),
        logout: build.query({
            query: () => ({
                url: '/logout',
            })
        }),
        secret: build.query({
            query: () => ({
                headers: { Authorization: `Bearer ${accessTokenService.getAccessToken()}` },
                url: '/secret',
            })
        })
    })
});

export const { useLoginMutation, useLogoutQuery, useRegisterMutation } = identityApi;