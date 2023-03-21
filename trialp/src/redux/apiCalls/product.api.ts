import axios from "axios";
import { Product } from "../../Models/Products/ProductType";
import { externalProxy } from "./proxy";


export const productApi = {
    getProductById: async (key: string) => {
        const resp = await externalProxy.get(`/getproductbykey?key=${key}`);
        const castRes = resp.data as Product;
        return castRes;
    }
}