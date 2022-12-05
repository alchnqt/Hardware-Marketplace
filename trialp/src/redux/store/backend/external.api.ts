import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { ProductAllShop } from '../../../Models/Products/ProductAllShop';
import { Product, ProductsResult } from '../../../Models/Products/ProductType';

export const externalProductsApi = createApi({
    reducerPath: 'apiProducts/',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["apiSpoof"]
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
        })
    })
});

export const { useProductsQuery, useProductQuery, useProductShopsQuery } = externalProductsApi;