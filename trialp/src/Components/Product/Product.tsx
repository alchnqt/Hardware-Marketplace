
import { Button, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PositionsPrimary, ProductShop } from '../../Models/Products/ProductAllShop';
import { useProductQuery, useProductShopsQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../CircularLoader/CircularLoader';
import styles from './product.module.css';
interface ProductShopMap {
    key: string,
    value: ProductShop
}

function Product() {
    let { key } = useParams();
    const shopQuery = useProductShopsQuery({ key: key });
    const productQuery = useProductQuery({ key: key });

    if (shopQuery.isLoading && productQuery.isLoading) {
        return (
            <CircularLoader />
        );
    }
    else {
        const array: ProductShopMap[] = [];
        if (shopQuery.data?.shops != undefined) {
            Object.entries(shopQuery.data?.shops).forEach(
                ([key, value]) => array.push({ key, value })
            );
        }
        return (
            <Container>
                <div className={`${styles.productItself}`}>
                    <img src={`${productQuery.data?.images.header}`} />
                    <div className={`${styles.description}`}>
                        <h3>{productQuery.data?.extended_name}</h3>
                        <p>{productQuery.data?.description}</p>
                    </div>
                </div>
                <hr />
                {array.map(x => {
                    let primary: PositionsPrimary | undefined = shopQuery.data?.positions.primary.find(obj => {
                        return obj.shop_id == x.key
                    });
                    return <>
                        <div className={`${styles.prouduct}`}>
                            <div className={`${styles.element}`}>
                                <div className={`${styles.currency}`}>
                                    <h2>{primary?.position_price.amount} {primary?.position_price.currency}</h2>
                                </div>
                                <div className={`${styles.article}`}>
                                    <p>{primary?.comment}</p>
                                    <small>Импортер: {primary?.importer}</small>
                                </div>
                                <div className={`${styles.buy}`}>
                                    <div>
                                        <Button className={`${styles.buyNow}`} type="button">Купить сейчас</Button>
                                        <Button className={`${styles.toCart}`} type="button">В корзину</Button>
                                    </div>
                                    <div>
                                        <img src={`${x.value.logo}`} />
                                        
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