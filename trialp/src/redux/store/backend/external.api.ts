import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import accessTokenService from '../../../Auth/AccessToken';
import { AdminOrders, AllOrders, UserOrders } from '../../../Models/Products/Order';
import { ProductAllShop } from '../../../Models/Products/ProductAllShop';
import { Product, ProductsResult } from '../../../Models/Products/ProductType';
import { store } from '../store';

export const externalProductsApi = createApi({
    reducerPath: 'externalApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["apiSpoof"],
        prepareHeaders: (headers, { getState }) => {
            console.log(store.getState().auth.accessToken);
            headers.set('Authorization', `Bearer ${store.getState().auth.accessToken}`);
            // headers.set('Access-Control-Allow-Origin', 'localhost');
            // headers.set('Access-Control-Allow-Credentials', 'true');
            return headers
        },
        credentials: 'include'
    }
    ),
    endpoints: build => ({
        products: build.query<any, { subsubcategory: string, page: number }>({
            query: (args) => {
                const { subsubcategory, page } = args;
                return {
                    url: `/GetProductsBySubSubCategory?subsubcategory=${subsubcategory}&page=${page}`,
                }
            }
        }),
        productShops: build.query<ProductAllShop, { key: string | undefined }>({
            query: (args) => {
                const { key } = args;
                return {
                    url: `/GetProductShopsByKey?key=${key}`,
                }
            }
        }),
        product: build.query<Product, { key: string | undefined }>({
            query: (args) => {
                const { key } = args;
                return {
                    url: `/GetProductByKey?key=${key}`,
                }
            }
        }),
        allOrders: build.query<AdminOrders, any>({
            query: (args) => {
                return {
                    url: `/GetAllOrders`,
                }
            }
        }),
        completeOrder: build.mutation<any, { userId: string }>({
            query: (args) => {
                let { userId } = args;
                return {
                    method: 'POST',
                    url: `/CompleteOrders/${userId}`,
                }
            }
        }),
        userOrders: build.query<UserOrders, { key: string, isCompleted: boolean }>({
            query: (args) => {
                const { key, isCompleted } = args;
                return {
                    url: `/GetUsersOrderById/${key}?isCompleted=${isCompleted}`,
                }
            }
        }),
        search: build.query<any, string>({
            query: (key) => {
                return {
                    url: `/search`
                }
            }
        })
    })
});

export const { useProductsQuery, useProductQuery, useProductShopsQuery, useUserOrdersQuery, useAllOrdersQuery, useCompleteOrderMutation } = externalProductsApi;