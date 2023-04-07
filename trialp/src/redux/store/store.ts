import { configureStore } from "@reduxjs/toolkit";
import { categoriesApi } from '../store/backend/categoriesServer.api';
import { ordersApi } from '../store/backend/ordersServer.api';
import { externalProductsApi } from "./backend/external.api";
import authReducer from "../slices/authSlice";
import messageReducer from "../slices/messageSlice";
import userReducer from '../slices/userSlice';
import cartReducer from '../slices/cartSlice';
import productsReducer from '../slices/productsSlice';
import shopReducer from '../slices/shopSlice';
import reviewReducer from '../slices/reviewsSlice';
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
import { identityApi } from "./backend/identityServer.api";
import { shopsApi } from "./backend/shopServer.api";


const persistConfig = {
    key: 'root',
    storage,
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [externalProductsApi.reducerPath]: externalProductsApi.reducer,
        [shopsApi.reducerPath]: shopsApi.reducer,
        [identityApi.reducerPath]: identityApi.reducer,
        
        user: userReducer,
        auth: persistedAuthReducer,
        message: messageReducer,
        cart: persistedCartReducer,
        product: productsReducer,
        shop: shopReducer,
        review: reviewReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }).concat([
        externalProductsApi.middleware, 
        categoriesApi.middleware, 
        ordersApi.middleware, 
        identityApi.middleware, 
        shopsApi.middleware])
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector