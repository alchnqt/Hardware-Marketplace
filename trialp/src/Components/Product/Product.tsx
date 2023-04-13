
import { Button, Container, Link, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLazyProductQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../Loader/CircularLoader';
import styles from './product.module.css';
import BasicTabs from './Tabs/ProductTabs';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Review } from './Review/Review';
import Recommendations from './Recommendations/Recommendations';
enum ProductState {
    Tabs,
    CreateReviews
}

export const Product = () => {
    const { key } = useParams();
    const [trigger, result] = useLazyProductQuery();
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);
    const [productState, setProductState] = useState<ProductState>(ProductState.Tabs);

    useEffect(() => {
        if (!result.isSuccess && !result.isLoading && !result.isError)
            trigger({ key: key }, false);
    })

    if (result.isLoading) {
        return (
            <CircularLoader />
        );
    }

    else {
        return (
            <Container>
                <div className={`${styles.productItself}`}>
                    <img src={`${result.data?.images.header}`} />
                    <div className={`${styles.description}`}>
                        <h3>{result.data?.extended_name}</h3>
                        <p>{result.data?.description}</p>
                        <div className={`${styles.reviews}`}>
                            <Rating className={`${styles.ratingContainer}`}
                                name="read-only" value={(result.data?.reviews.rating || 0 / 10)} readOnly />
                            <Link className={`${styles.reviewsLink}`} target="_blank"
                                href={`${result.data?.reviews.html_url}`}>
                                Всего отзывов: {result.data?.reviews.count}</Link>
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
                    <>
                        <Recommendations productKey={result.data?.key || ''}/>
                        <BasicTabs product={result.data} />
                    </>
                    : null}
                {productState === ProductState.CreateReviews ?
                    <Review
                        productName={result.data?.full_name || ''}
                        userId={user.id}
                        apiProductId={result.data?.key || ''}
                        productId={result.data?.dbId || ''}
                    />
                    : null}
            </Container>
        );
    }
}

export default Product;