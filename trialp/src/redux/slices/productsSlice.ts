import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../Models/Products/ProductType";
import { externalProductsApi } from "../store/backend/external.api";
import { RootState } from "../store/store";
import { productThunks } from "../thunks/productThunks";

interface ProductState{
    page: number,
    product: Product | null,
    loading: boolean,
    fullfilled: boolean,
    rejected: boolean,
    apiPage: {
        current: number,
        last: number
    }
}

const initialState: ProductState = {
    page: 1,
    product: null,
    loading: false,
    fullfilled: false,
    rejected: false,
    apiPage: {
        current: 0,
        last: 0
    }
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        incrementPage: (state, action) => {
            state.page++;
            window.scrollTo(0, 0)
        },
        decrementPage: (state, action) => {
            if (state.page > 1) {
                state.page--;
            }
            window.scrollTo(0, 0)
        },
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(externalProductsApi.endpoints.product.matchPending, (state, action) => {
            state.loading = true;
        })
        .addMatcher(
            externalProductsApi.endpoints.product.matchFulfilled, (state, action) => {
                state.loading = false;
                state.fullfilled = true;
                state.product = action.payload;
            }
        )
        .addMatcher(externalProductsApi.endpoints.product.matchRejected, (state, action) => {
            state.loading = false;
            state.rejected = true;
        })
        .addMatcher(externalProductsApi.endpoints.products.matchFulfilled, (state, action) => {
            state.apiPage = action.payload.page
        })
    }
});
const { reducer, actions } = productsSlice;

export const { incrementPage, decrementPage } = actions
export default reducer;
export const selectCurrentProduct = (state: RootState) => state.product;
