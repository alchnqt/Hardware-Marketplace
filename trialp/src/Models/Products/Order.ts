import { PositionsPrimary } from "./ProductAllShop"
import { Product } from "./ProductType"



export interface PositionsPrimaryOrder {
    count: number,
    positionsPrimaryValue: {
        positionsPrimary: PositionsPrimary,
        product: Product
    }

}

export interface Order {
    key: string,
    amount: string,
    count: number,
    positionsPrimary: PositionsPrimaryOrder[]
}

export interface AllOrders {
    userOrders: UserOrders[]
}

export interface AdminOrder {
    id: string,
    key: string,
    isCompleted: boolean
}
export interface CustomerOrder {
    count: number,
    userId: string,
    orders: AdminOrder[]
}

export interface AdminOrders {
    userOrders: CustomerOrder[]
}



export interface UserOrders {
    id: string
    orders: Order[]
}