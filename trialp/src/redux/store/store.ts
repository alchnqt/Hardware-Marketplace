import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../store/backend/productsServer.api';
import { externalProductsApi } from "./backend/external.api";
import authReducer from "../slices/authSlice";
import messageReducer from "../slices/messageSlice";
import userReducer from '../slices/userSlice';
import cartReducer from '../slices/cartSlice';
import productsReducer from '../slices/productsSlice';
import {
    persistStore, persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


const persistConfig = {
    key: 'root',
    storage,
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        [externalProductsApi.reducerPath]: externalProductsApi.reducer,
        user: userReducer,
        auth: persistedAuthReducer,
        message: messageReducer,
        cart: persistedCartReducer,
        product: productsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })
        .concat([externalProductsApi.middleware, productsApi.middleware])
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector