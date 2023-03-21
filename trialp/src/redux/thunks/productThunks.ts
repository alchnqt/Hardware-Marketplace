import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from '../../Models/Products/ProductType';
import { productApi } from '../apiCalls/product.api';


export const productThunks = {
    getProductById: createAsyncThunk('product/getProductByKey',
    (key: string, productThunkApi) => productApi.getProductById(key) as Promise<Product>)
};