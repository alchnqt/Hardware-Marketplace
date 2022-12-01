
import { Button, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductShop } from '../../Models/Products/ProductAllShop';
import { useProductQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../CircularLoader/CircularLoader';
import styles from './product.module.css';
interface ProductShopMap {
    key: string,
    value: ProductShop
}

function Product() {
    let { key } = useParams();
    const { data, error, isLoading } = useProductQuery({ key: key });
    if (isLoading) {
        return (
            <CircularLoader />
        );
    }
    else {
        const array: ProductShopMap[] = [];
        if (data?.shops != undefined) {
            Object.entries(data?.shops).forEach(
                ([key, value]) => array.push({ key, value })
            );
        }
        if (array != undefined) {
            console.log(array);
        }
        return (
            <Container>
                {array.map(x => {
                    let { amount, currency }: any = data?.positions.primary.find(obj => {
                        return obj.shop_id == x.key
                    })?.position_price;

                    return <>
                        <div className={`${styles.prouduct}`}>
                            <div className={`${styles.element}`}>
                                <div>
                                    <div className={`${styles.currency}`}>
                                        <b>{amount} {currency}</b>
                                    </div>

                                </div>
                                <div className={`${styles.buy}`}>
                                    <Button type="button">Купить сейчас</Button>
                                    <div>
                                        <img src={`${x.value.logo}`} />
                                        <span className={`${styles.title}`}>{x.value.title}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </>
                }
                )}
            </Container>
        );
    }
}

export default Product;