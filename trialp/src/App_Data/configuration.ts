export const DEFAULT_OCELOT_GATEWAY: string = 'https://localhost:7003/api';

interface Endpoints<T> {
    [Key: string]: T;
}
type Config = {
    endpoints: Endpoints<string>
};

export const CONFIG: Config = {
    endpoints: 
    {
        ["auth"]: `${DEFAULT_OCELOT_GATEWAY}/identity/auth`,
        ["products"]: `${DEFAULT_OCELOT_GATEWAY}/product/products`,
        ["categories"]: `${DEFAULT_OCELOT_GATEWAY}/product/categories`,
        ["apiSpoof"]: `${DEFAULT_OCELOT_GATEWAY}/product/apispoof`,
    },
    
};