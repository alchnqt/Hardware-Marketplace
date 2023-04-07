import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../Models/Products/ProductType";
import { externalProductsApi } from "../store/backend/external.api";
import { RootState } from "../store/store";
import { productThunks } from "../thunks/productThunks";
import { ProductReviews } from "../../Models/Reviews/ProductReviews";

interface ReviewsState{
    page: number,
    reviews: ProductReviews | null,
    loading: boolean,
    fullfilled: boolean,
    rejected: boolean,
    apiPage: {
        current: number,
        last: number
    }
}

const initialState: ReviewsState = {
    page: 1,
    reviews: null,
    loading: false,
    fullfilled: false,
    rejected: false,
    apiPage: {
        current: 0,
        last: 0
    }
};

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        incrementPage: (state, action) => {
            state.page++;
            state.apiPage.current++;
            window.scrollTo(0, 0)
        },
        decrementPage: (state, action) => {
            if (state.page > 1) {
                state.page--;
                state.apiPage.current--;
            }
            window.scrollTo(0, 0)
        },
        hardResetPage: (state, action) => {
            state.page = 1;
            state.apiPage.current = 1;
        }
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(externalProductsApi.endpoints.reviews.matchPending, (state, action) => {
            state.loading = true;
        })
        .addMatcher(
            externalProductsApi.endpoints.reviews.matchFulfilled, (state, action) => {
                state.loading = false;
                state.fullfilled = true;
                state.reviews = action.payload;
            }
        )
        .addMatcher(externalProductsApi.endpoints.reviews.matchRejected, (state, action) => {
            state.loading = false;
            state.rejected = true;
        })
        .addMatcher(externalProductsApi.endpoints.reviews.matchFulfilled, (state, action) => {
            state.apiPage = action.payload.page
        })
    }
});
const { reducer, actions } = reviewsSlice;

export const { incrementPage, decrementPage, hardResetPage } = actions
export default reducer;
export const selectCurrentProduct = (state: RootState) => state.product;