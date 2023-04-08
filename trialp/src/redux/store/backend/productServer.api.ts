import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { Product } from '../../../Models/Products/ProductType';



export const productsApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["products"]
    }
    ),
    endpoints: build => ({
        top3CoProductsByProductApiKey: build.query<Array<Product | null>, { key: string }>({
            query: (args) => {
                const { key } = args;
                return {
                    url: `/top3coproductsbyproductapikey/${key}`,
                }
            }
        })
    }),
});
export const { useTop3CoProductsByProductApiKeyQuery } = productsApi;