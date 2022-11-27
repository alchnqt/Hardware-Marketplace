import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
    phone: string | null
}

export const identityApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
            baseUrl: 'https://localhost:7077/'
        }
    ),
    endpoints: build => ({
        login: build.mutation<AccessToken, LoginDto>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: 'auth/login',
            })
        }),
        register: build.mutation<string, RegisterDto>({
            query: (data) => ({
                method: 'POST',
                url: 'auth/register',
                body: data,
            })
        }),
        logout: build.query({
            query: () => ({
                url: 'auth/logout',
            })
        }),
        secret: build.query({
            query: () => ({
                headers: { Authorization: `Bearer ${accessTokenService.getAccessToken()}` },
                url: 'auth/secret',
            })
        })
    })
});

export const { useLoginMutation, useLogoutQuery } = identityApi;