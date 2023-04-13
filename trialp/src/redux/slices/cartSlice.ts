import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: string,
    idDb: string,
    shopName: string,
    key: string,
    shopId: string,
    title: string,
    image: string,
    amount: string,
    currency: string,
    quantity?: number,
    text: string,
    category: string
}



const initialState = {
    cart: [] as CartItem[],
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const itemInCart: any = current(state).cart.find((item: CartItem) => item.id === action.payload.id);
            console.log(current(state).cart);
            if (itemInCart) {
                state.cart.forEach((obj) => {
                    if (obj.id === action.payload.id && obj.quantity) {
                        obj.quantity++;
                    }
                })
            }
            else {
                //console.log(action.payload.item);
                action.payload.quantity = 1;
                state.cart.push(action.payload);
            }
        },
        incrementQuantity: (state: any, action: any) => {
            const item: any = state.cart.find((item: any) => item.id === action.payload);
            item.quantity++;
        },
        decrementQuantity: (state: any, action: any) => {
            const item: any = state.cart.find((item: any) => item.id === action.payload);
            if (item.quantity === 1) {
                item.quantity = 1
            } else {
                item.quantity--;
            }
        },
        removeItem: (state, action: PayloadAction<CartItem>) => {
            if ((action.payload.quantity || 1) > 1) {
                state.cart.forEach((obj) => {
                    if (obj.id === action.payload.id && obj.quantity) {
                        obj.quantity--;
                    }
                })
                return;
            }

            let index: number = current(state).cart.indexOf(action.payload);
            if (index > -1) {
                let newArr = current(state).cart.filter((item: CartItem) => action.payload.id !== item.id); 
                state.cart = newArr;
            }
        },
        cleanCart: (state) => {
            state.cart = [];
        }
    },
});
export default cartSlice.reducer;
export const {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    cleanCart
} = cartSlice.actions;