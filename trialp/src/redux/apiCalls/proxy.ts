import axios from "axios";
import { CONFIG, DEFAULT_OCELOT_GATEWAY } from '../../App_Data/configuration';

export const defaultProxy = axios.create();
defaultProxy.defaults.baseURL = DEFAULT_OCELOT_GATEWAY;

export const productProxy = axios.create();
productProxy.defaults.baseURL = CONFIG.endpoints["products"]

export const externalProxy = axios.create({
    baseURL: CONFIG.endpoints["apiSpoof"]
});

