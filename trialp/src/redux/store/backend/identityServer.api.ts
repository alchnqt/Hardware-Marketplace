import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const identityApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
            baseUrl: 'https://localhost:7077/'
        }
    ),
    endpoints: build => ({
        login: build.mutation<any, any>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: 'auth/login',
            })
        }),
        register: build.mutation({
            query: () => ({
                url: 'auth/register',
            })
        }),
        logout: build.query({
            query: () => ({
                url: 'auth/logout',
            })
        })
    })
});

export const { useLoginMutation, useLogoutQuery } = identityApi;