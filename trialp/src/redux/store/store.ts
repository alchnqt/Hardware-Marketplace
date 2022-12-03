import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../store/backend/productsServer.api';
import { externalProductsApi } from "./backend/external.api";
import authReducer from "../slices/authSlice";
import messageReducer from "../slices/messageSlice";
import userReducer from '../slices/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        [externalProductsApi.reducerPath]: externalProductsApi.reducer,
        user: userReducer,  
        auth: persistedReducer,
        message: messageReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat([externalProductsApi.middleware, productsApi.middleware])
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector