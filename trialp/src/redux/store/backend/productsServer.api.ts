import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { MainCategory } from '../../../Models/Products/CategoriesType';

export const productsApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["categories"]
    }
    ),
    endpoints: build => ({
        categories: build.query<MainCategory, undefined>({
            query: () => ({
                url: '/geteverything',
            })
        })
    })
});

export const { useCategoriesQuery } = productsApi;