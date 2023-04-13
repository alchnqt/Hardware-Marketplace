import { Box, Button, Container } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { EMAIL_CLAIM, ID_CLAIM } from '../../redux/slices/authSlice';
import { cleanCart, removeItem } from '../../redux/slices/cartSlice';
import { RootState, useAppDispatch } from '../../redux/store/store';
import OrderModal from '../OrderModal/OrderModal';
import styles from './cart.module.css';

interface ItemToCompare {
    name: string,
    amount: string,
    shopName: string,
    text: string,
    category: string
}

interface ComparerProps {
    item1: ItemToCompare | null,
    item2: ItemToCompare | null
}

const Comparer = (props: ComparerProps) => {
    if (props.item1 === null)
        return (<div className='text-info'>Выберете товар для сравнения</div>)
    if (props.item2 === null)
        return (<div className='text-info'>Выберете ещё для сравнения</div>)

    return (
        <Box component="div">
            <hr />
            <h2 className={`${styles.comparerHeader}`}>Сравнение товаров</h2>
            <div className={`${styles.comparerContainer}`}>
                <div className={`${styles.compareItem}`}>
                    <h2>
                        {props.item1.name} от {props.item1.shopName}
                    </h2>
                    <div>{props.item1.text}</div>
                    <h4 className={`${props.item1.amount < props.item2.amount ? styles.amountSuccess : ''}`}>Стоимость: {props.item1.amount} BYN</h4>
                </div>
                <div className={`${styles.compareItem}`}>
                    <h2>
                        {props.item2.name} от {props.item2.shopName}
                    </h2>
                    <div>{props.item2.text}</div>
                    <h4 className={`${props.item2.amount < props.item1.amount ? styles.amountSuccess : ''}`}>Стоимость: {props.item2.amount} BYN</h4>
                </div>
            </div>
        </Box>);
}

const Cart = () => {
    const { cart } = useSelector((state: RootState) => state.cart);
    const dispatch = useAppDispatch();
    let allAmount: number = 0;
    const { user } = useSelector((state: any) => state.auth);
    let currency = "BYN";

    const [error, setError] = useState<boolean>(false);
    const [item1, setItem1] = useState<ItemToCompare | null>(null);
    const [item2, setItem2] = useState<ItemToCompare | null>(null);

    const handleComparer = (item: ItemToCompare) => {
        if (item1 === null) {
            setItem1(item);
            setError(false);
            return;
        }
        if (item2 === null) {
            setItem2(item);
            setError(false);
            return;
        }
    }
    const handleCleanComparer = () => {
        setItem1(null);
        setItem2(null);
    }

    useEffect(() => {
        if (item1 !== null && item2 !== null
            && item1.category !== item2.category){
                setError(true);
                handleCleanComparer();
            }
    }, [item1, item2]);

    let orderMap: string[] = [];
    cart.forEach(function (x) {
        let count = x.quantity || 0;
        while (count != 0) {
            count--;
            orderMap.push(x.idDb);
        }
    });

    return (
        <div className='container'>
            {cart.map(item => {
                allAmount += (item.amount as any) * (item.quantity || 1);
                return (<div key={item.id} className={styles.cartItem}>
                    <img src={item.image} />
                    <div className={`${styles.name}`}>{item.title} - {item.amount} {item.currency} от <b>{item.shopName}</b>. Количество: {item.quantity}</div>
                    <div className={`${styles.btns}`}>
                        <Button onClick={() => handleComparer({
                            name: item.title,
                            amount: item.amount,
                            shopName: item.shopName,
                            text: item.text,
                            category: item.category
                        })}>В сравнение</Button>
                        <Button onClick={() => dispatch(removeItem(item))}>Убрать</Button>
                    </div>
                </div>)
            })}
            {cart.length > 0 && (<div>Всего: {allAmount.toFixed(2)} {currency}</div>)}

            {cart.length >= 1 && (<OrderModal order={{
                userId: user[ID_CLAIM] || "",
                email: user[EMAIL_CLAIM] || "",
                orders: orderMap
            }} cartCallback={() => dispatch(cleanCart())} />)}

            {item1 && item2 && item1.category === item2.category ? <>
                <br />
                <br />
                <div>
                    <Button onClick={() => { handleCleanComparer() }}>Очистить сравнения</Button>
                </div>
            </>
                :
                null
            }
            <Comparer item1={item1} item2={item2}/>
            {error ? <div className='text-danger'>Товары должны быть одной категории</div> : null}

        </div>
    );
}

export default Cart;