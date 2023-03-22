export interface PositionsPrimary {
    id: string,
    dbId: string,
    key: string,
    product_id: number,
    article: string,
    manufacturer_id: number,
    shop_id: string,
    position_price: {
        amount: string,
        currency: string
    },

    amount: string,
    currency: string,

    comment: string,
    producer: string,
    importer: string,
    service_centers: string,
    product_url: string,
    shop_url: string,
    shop_full_info_url: string,
    schema_url: string
}

export interface ProductShop {
    full_info_url: string,
    html_url: string,
    id: number,
    logo: string,
    title: string,
    url: string
}
export interface ProductAllShop {
    positions: {
        primary: Array<PositionsPrimary>
    },
    shops: {
        [key: string]: ProductShop;
    }
}