
import { Button, Container, Link, Rating } from '@mui/material';
import React, { useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { PositionsPrimary, ProductShop } from '../../Models/Products/ProductAllShop';
import { useProductQuery, useProductShopsQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../Loader/CircularLoader';
import styles from './product.module.css';
import { addToCart, CartItem } from '../../redux/slices/cartSlice';
import { useAppDispatch } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import OrderModal from '../OrderModal/OrderModal';
import { EMAIL_CLAIM, ID_CLAIM } from '../../redux/slices/authSlice';

interface ProductShopMap {
    key: string,
    value: ProductShop
}

function Product() {

    let { key } = useParams();
    const shopQuery = useProductShopsQuery({ key: key });
    const productQuery = useProductQuery({ key: key });
    const dispatch = useAppDispatch();
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);

    const handleCart = (item: CartItem): void => {
        dispatch(addToCart(item))
    };


    if (shopQuery.isLoading && productQuery.isLoading) {
        return (
            <CircularLoader />
        );
    }
    else {
        const array: ProductShopMap[] = [];
        if (shopQuery.data?.shops !== undefined) {
            Object.entries(shopQuery.data?.shops).forEach(
                ([key, value]) => array.push({ key, value })
            );
        }
        const copyPositionsPrimary: PositionsPrimary[] = [...shopQuery.data?.positions.primary || []];
        const sortedPP = [...copyPositionsPrimary.sort((a, b) => a.amount > b.amount ? 1 : -1)];
        return (
            <Container>
                <div className={`${styles.productItself}`}>
                    <img src={`${productQuery.data?.images.header}`} />
                    <div className={`${styles.description}`}>
                        <h3>{productQuery.data?.extended_name}</h3>
                        <p>{productQuery.data?.description}</p>
                        <div className={`${styles.reviews}`}>
                            <Rating className={`${styles.ratingContainer}`} name="read-only" value={(productQuery.data?.reviews.rating || 0 / 10)} readOnly />
                            <Link className={`${styles.reviewsLink}`} target="_blank" href={`${productQuery.data?.reviews.html_url}`}>Отзывов: {productQuery.data?.reviews.count}</Link>
                        </div>
                    </div>
                </div>
                <hr />
                <div className={`${styles.positionsPrimaryContainer}`}>
                    {sortedPP.map(primary => {
                        let x: ProductShopMap | undefined = array.find(obj => {
                            return parseInt(primary.shop_id) === obj.value.id
                        });
                        return <div key={x?.key}>
                            <div className={`${styles.prouduct}`}>
                                <div className={`${styles.element}`}>
                                    <div className={`${styles.currency}`}>
                                        <h2>{primary?.amount ?? (<span style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>Уточняйте у продавца</span>)} {primary?.currency}</h2>
                                    </div>
                                    <div className={`${styles.article}`}>
                                        <p>{primary?.comment}</p>
                                        <small>Импортер: {primary?.importer ?? (<span>Информация отсутствует</span>)}</small>
                                    </div>
                                    <div className={`${styles.buy}`}>
                                        <div>
                                            {isLoggedIn && <OrderModal order={{
                                                userId: user[ID_CLAIM] || "",
                                                email: user[EMAIL_CLAIM] || "",
                                                orders: [`${primary?.dbId}`]
                                            }} />}

                                            <Button className={`${styles.toCart}`} onClick={() => {
                                                const item: CartItem = {
                                                    id: `${productQuery.data?.id || ""}${primary?.shop_id || ""}`,
                                                    idDb: primary?.dbId || "",
                                                    key: productQuery.data?.id || "",
                                                    shopId: primary?.shop_id || "",
                                                    shopName: x?.value.title || "",
                                                    title: productQuery.data?.extended_name || "",
                                                    image: productQuery.data?.images.header || "",
                                                    amount: primary?.amount || "",
                                                    currency: primary?.currency || ""
                                                };
                                                handleCart(item)
                                            }} type="button">В корзину</Button>
                                        </div>
                                        <div>
                                            <img src={`${x?.value.logo}`} />
                                            {x?.value.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    }
                    )}
                </div>
            </Container>
        );
    }
}

export default Product;