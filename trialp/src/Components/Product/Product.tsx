
import { Button, Container, Link, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useProductQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../Loader/CircularLoader';
import styles from './product.module.css';
import BasicTabs from './Tabs/ProductTabs';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Review } from './Review/Review';

enum ProductState {
    Tabs,
    CreateReviews
}

export const Product = () => {
    const { key } = useParams();
    const productQuery = useProductQuery({ key: key });
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);
    const [productState, setProductState] = useState<ProductState>(ProductState.Tabs);

    if (productQuery.isLoading) {
        return (
            <CircularLoader />
        );
    }
    else {
        return (
            <Container>
                <div className={`${styles.productItself}`}>
                    <img src={`${productQuery.data?.images.header}`} />
                    <div className={`${styles.description}`}>
                        <h3>{productQuery.data?.extended_name}</h3>
                        <p>{productQuery.data?.description}</p>
                        <div className={`${styles.reviews}`}>
                            <Rating className={`${styles.ratingContainer}`} name="read-only" value={(productQuery.data?.reviews.rating || 0 / 10)} readOnly />
                            <Link className={`${styles.reviewsLink}`} target="_blank" href={`${productQuery.data?.reviews.html_url}`}>
                                Всего отзывов: {productQuery.data?.reviews.count}</Link>
                        </div>
                    </div>
                    {isLoggedIn ?
                        <>
                            {productState === ProductState.Tabs ?
                                <Button
                                    variant="contained"
                                    style={{ width: '220px' }}
                                    onClick={() => {
                                        setProductState(ProductState.CreateReviews)
                                    }}>Оставить отзыв</Button>

                                : <Button
                                    variant="contained"
                                    style={{ width: '220px' }}
                                    onClick={() => {
                                        setProductState(ProductState.Tabs)
                                    }}>
                                    Посмотреть предложения</Button>}
                        </>
                        : null}
                </div>
                <hr />
                {productState === ProductState.Tabs ?
                    <BasicTabs product={productQuery.data} />
                    : null}
                {productState === ProductState.CreateReviews ?
                    <Review
                        productName={productQuery.data?.full_name || ''}
                        userId={user.id}
                        apiProductId={productQuery.data?.key || ''}
                        productId={productQuery.data?.dbId || ''}
                    />
                    : null}
            </Container>
        );
    }
}

export default Product;