import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { ProductAllShop } from '../../../Models/Products/ProductAllShop';
import { ProductsResult } from '../../../Models/Products/ProductType';

export const externalProductsApi = createApi({
    reducerPath: 'apiProducts/',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["apiSpoof"]
    }
    ),
    endpoints: build => ({
        products: build.query<any, {subsubcategory: string}>({
            query: (args) => {
                const { subsubcategory } = args;
                return {
                    url: `/GetProductsBySubSubCategory?subsubcategory=${subsubcategory}`,
                }
            }
        }),
        product: build.query<ProductAllShop, { key: string | undefined }>({
            query: (args) => {
                const { key } = args;
                return {
                    url: `/GetProductByKey?key=${key}`,
                }
            }
        })
    })
});

export const { useProductsQuery, useProductQuery } = externalProductsApi;