import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    page: 1
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
});

const { reducer, actions } = productsSlice;

export const { incrementPage, decrementPage } = actions
export default reducer;