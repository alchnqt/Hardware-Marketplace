import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { MainCategory } from '../../../Models/Products/CategoriesType';

export interface SubSubCategoryDto {
    id: string | null, 
    name: string,
    apiName: string,
    subCategoryName: string | null
}

export const categoriesApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["categories"]
    }
    ),
    endpoints: build => ({
        categories: build.query<MainCategory, undefined>({
            query: () => ({
                url: '/geteverything',
            })
        }),
        addCategory: build.mutation<any, SubSubCategoryDto>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: 'addCategory',
            })
        }),
        updateCategory: build.mutation<any, SubSubCategoryDto>({
            query: (data) => ({
                method: 'PUT',
                body: data,
                url: 'updateCategory',
            })
        }),
        removeCategory: build.mutation<any, SubSubCategoryDto>({
            query: (data) => ({
                method: 'DELETE',
                body: data,
                url: 'removeCategory',
            })
        })
    }),
});

export const { useCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useRemoveCategoryMutation  } = categoriesApi;