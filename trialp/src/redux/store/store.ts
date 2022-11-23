import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../store/backend/productsServer.api';
import { externalProductsApi } from "./backend/external.api";
export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        [externalProductsApi.reducerPath]: externalProductsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat([externalProductsApi.middleware, productsApi.middleware])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;