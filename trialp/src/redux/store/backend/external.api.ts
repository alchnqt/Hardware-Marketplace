import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '../../../App_Data/configuration';
import { AdminOrders, UserOrders } from '../../../Models/Products/Order';
import { ProductAllShop } from '../../../Models/Products/ProductAllShop';
import { Product } from '../../../Models/Products/ProductType';
import ShopResult from '../../../Models/Shop/ShopResult';
import { refreshToken } from '../../slices/authSlice';
import ProductReviews, { CreateReview } from '../../../Models/Reviews/ProductReviews';

export const externalProductsApi = createApi({
    reducerPath: 'externalApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.endpoints["apiSpoof"],
        prepareHeaders: async (headers, query) => {
            const authResult = await refreshToken();
            if (authResult.user !== null) {
                headers.set('Authorization', 'Bearer ' + authResult.message);
            }
            return headers;
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
        }),
        shop: build.query<ShopResult, { id: number }>({
            query: (args) => {
                const { id } = args;
                return {
                    url: `/getshopbyid?id=${id}`,
                }
            }
        }),
        reviews: build.query<ProductReviews, { key: string, page: number, isSelf: boolean }>({
            query: (args) => {
                const { key, page, isSelf } = args;
                return {
                    url: `/getproductreviewsbykey?key=${key}&page=${page}&isSelf=${isSelf}`,
                }
            }
        }),
        createReview: build.mutation<any, CreateReview>({
            query: (data) => {
                return {
                    method: 'POST',
                    url: `/createproductreview`,
                    body: data
                }
            }
        }),
    })
});

export const {
    useProductsQuery,
    useProductQuery,
    useLazyProductQuery,
    useProductShopsQuery,
    useUserOrdersQuery,
    useAllOrdersQuery,
    useCompleteOrderMutation,
    useShopQuery,
    useReviewsQuery,
    useLazyReviewsQuery,
    useCreateReviewMutation
} = externalProductsApi;