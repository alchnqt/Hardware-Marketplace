import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../Models/Products/ProductType";
import ShopResult from "../../Models/Shop/ShopResult";
import { externalProductsApi } from "../store/backend/external.api";
import { RootState } from "../store/store";
import { productThunks } from "../thunks/productThunks";

interface ShopState{
    shop: ShopResult | null,
    loading: boolean,
    fullfilled: boolean,
    rejected: boolean,
}

const initialState: ShopState = {
    shop: null,
    loading: false,
    fullfilled: false,
    rejected: false,
}

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addMatcher(externalProductsApi.endpoints.shop.matchFulfilled, (state, action) => {
            state.fullfilled = true;
            state.shop = action.payload;
        })
    }
});
const { reducer, actions } = shopSlice;

export default reducer;
