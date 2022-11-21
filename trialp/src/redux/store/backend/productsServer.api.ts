import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MainCategory } from '../../../Models/Products/CategoriesType';

export const productsApi = createApi({
    reducerPath: 'api/',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7288/'
    }
    ),
    endpoints: build => ({
        categories: build.query<MainCategory, undefined>({
            query: () => ({
                url: 'api/categories/geteverything',
            })
        })
    })
});

export const { useCategoriesQuery } = productsApi;