export type Total = number;
export interface Page {
    limit: number,
    items: number,
    current: number,
    last: number
}
export type TotalUngrouped = number;

export interface Product {
    id: string,
    key: string,
    name: string,
    full_name: string,
    name_prefix: string,
    extended_name: string,
    status: string,
    images: {
        header: string,
        icon: string | null
    },
    description: string,
    microdescription: string,
    html_url: string,
    reviews: {
        rating: number,
        count: number,
        html_url: string,
        url: string
    },
    reviewUrl: string | null,
    colorCode: string | null,
    prices: {
        price_min: {
            amount: string,
            converted: {
                BYN: {
                    amount: string,
                    currency: string
                }
            }
            currency: string
        }
        priceMax: {
            amount: string,
            currency: string,
            converted: {
                BYN: {
                    amount: string,
                    currency: string
                }
            }
        },
        offers: {
            count: number
        },
        htmlUrl: string,
        url: string
    }
}

export interface ProductsResult {
    Page: Page,
    Products: Array<Product>,
    Total: number,
    TotalUngrouped: number
}