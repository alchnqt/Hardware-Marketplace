import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';

export interface Shop {
    apiId: number,
    title: string,
    logo: string | null
}



export const shopsApi = createApi({
    reducerPath: 'shopsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["shops"]
    }
    ),
    endpoints: build => ({
        shop: build.query<Shop, {id: string}>({
            query: (args) => {
                let { id } = args;
                return { url: `/${id}` };
            }
        }),
        addShop: build.mutation<any, Shop>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: '',
            })
        }),
        updateShop: build.mutation<any, Shop>({
            query: (data) => ({
                method: 'PUT',
                body: data,
                url: '',
            })
        }),
        removeShop: build.mutation<any, Shop>({
            query: (data) => ({
                method: 'DELETE',
                body: data,
                url: '',
            })
        })
    }),
});

export const { useShopQuery, useAddShopMutation, useUpdateShopMutation, useRemoveShopMutation } = shopsApi;