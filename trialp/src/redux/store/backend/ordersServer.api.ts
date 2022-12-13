import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';

export interface OrdersDto {
    userId: string,
    email: string,
    orders: string[]
}

export const ordersApi = createApi({
    reducerPath: 'orders',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["orders"]
    }
    ),
    endpoints: build => ({
        getOrders: build.query<any, undefined>({
            query: () => ({
                url: '/',
            })
        }),
        postOrder: build.mutation<any, OrdersDto>({
            query: (data) => ({
                method: 'POST',
                body: data,
                url: '',
            })
        }),
        putOrder: build.mutation<any, any>({
            query: (data) => ({
                method: 'PUT',
                body: data,
                url: '',
            })
        }),
        deleteOrder: build.mutation<any, any>({
            query: (data) => ({
                method: 'DELETE',
                body: data,
                url: '',
            })
        })
    }),
});

export const { useGetOrdersQuery, usePostOrderMutation, usePutOrderMutation, useDeleteOrderMutation } = ordersApi;