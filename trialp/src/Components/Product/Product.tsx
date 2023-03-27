
import { Container, Link, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useProductQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../Loader/CircularLoader';
import styles from './product.module.css';
import ProductShops from './ProductShops/ProductShops';
import BasicTabs from './Tabs/ProductTabs';



function Product() {

    const { key } = useParams();
    const productQuery = useProductQuery({ key: key });
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
                            <Link className={`${styles.reviewsLink}`} target="_blank" href={`${productQuery.data?.reviews.html_url}`}>Отзывов: {productQuery.data?.reviews.count}</Link>
                        </div>
                    </div>
                </div>
                <hr />
                <BasicTabs product={productQuery.data} />
            </Container>
        );
    }
}

export default Product;