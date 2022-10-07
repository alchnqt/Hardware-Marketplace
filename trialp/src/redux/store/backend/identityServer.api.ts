import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const identityApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
            baseUrl: 'https://localhost:7077/'
        }
    ),
    endpoints: build => ({
        login: build.query<any, any>({
            query: () => ({
                url: 'auth/login',
            })
        }),
        register: build.query({
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

export const { useLoginQuery } = identityApi;