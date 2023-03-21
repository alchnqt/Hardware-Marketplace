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

export interface User{
    userName: string,
    id: string,
    email: string
}

export const identityApi = createApi({
    reducerPath: 'authApi',
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
        logout: build.query<any, any>({
            query: () => ({
                url: '/logout',
            })
        }),
        allCustomers: build.query<User[], any>({
            query: () => ({
                url: '/AllCustomers'
            })
        }),
        secret: build.query<any, any>({
            query: () => ({
                headers: { Authorization: `Bearer ${accessTokenService.getAccessToken()}` },
                url: '/secret',
            })
        })
    })
});

export const { useLoginMutation, useLogoutQuery, useRegisterMutation, useAllCustomersQuery } = identityApi;