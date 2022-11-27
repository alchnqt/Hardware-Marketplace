import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../store/backend/productsServer.api';
import { externalProductsApi } from "./backend/external.api";
import userReducer from '../slices/userSlice';

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        [externalProductsApi.reducerPath]: externalProductsApi.reducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat([externalProductsApi.middleware, productsApi.middleware])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;