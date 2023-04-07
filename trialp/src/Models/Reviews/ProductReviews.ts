import { Page } from "../Products/ProductType"

export interface ProductReviews{
    reviews: ProductReview[]
    page: Page,
    total: number
}

export interface ProductReview {
    dbId: string
    userId: string | null
    id: number,
    rating: number
    product_id: string
    product_id_db: string | null
    product_url: string
    pros: string
    cons: string
    summary: string
    text: string
    created_at: string
    author: Author | null
}

export interface Author {
    id: number
    name: string
    avatar: Avatar
}

export interface Avatar {
    small: string
    large: string
}

export interface CreateReview{
    author: string,
    text: string,
    userId: string,
    apiProductId: string,
    productId: string,
    rating: number,
    cons: string,
    pros: string,
    summary: string
}

export default ProductReviews;