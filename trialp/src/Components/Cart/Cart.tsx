import { Button, Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { removeItem } from '../../redux/slices/cartSlice';
import { RootState, useAppDispatch } from '../../redux/store/store';
import styles from './cart.module.css';
const Cart = () => {
    const { cart } = useSelector((state: RootState) => state.cart);
    const dispatch = useAppDispatch();
    let allAmount: number = 0;
    let currency = "BYN";
    console.log(cart);
    return (
        <>
            <Container>
                {cart.map(item => {
                    allAmount += (item.amount as any) * (item.quantity || 1);
                    return (<div key={item.id} className={styles.cartItem}>
                        <img src={item.image} />
                        <div>{item.title} - {item.amount} {item.currency} by {item.shopId}. Количество: {item.quantity}</div>
                        <div>
                            <Button onClick={() => dispatch(removeItem(item))}>Убрать</Button>
                        </div>
                    </div>)
                })}
                {cart.length > 0 && (<div>Всего: {allAmount.toFixed(2)} {currency}</div>)}
            </Container>

        </>
    );
}

export default Cart;