export type Total = number;
export interface Page {
    limit: number,
    items: number,
    current: number,
    last: number
}
export type TotalUngrouped = number;

export interface AggregatedReviews{
    rating: number,
    count: number,

    externalCount: number,
    externalRating: number,

    internalCount: number,
    internalRating:number,

    url: string | null,
    html_url: string | null
}

export interface Product {
    id: string,
    dbId: string,
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
    },
    reviews: AggregatedReviews,
    category_name: string
}

export interface ProductsResult {
    Page: Page,
    Products: Array<Product>,
    Total: number,
    TotalUngrouped: number
}