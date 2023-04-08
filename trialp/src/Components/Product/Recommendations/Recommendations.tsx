import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './recommendations.module.css'
import { useTop3CoProductsByProductApiKeyQuery } from '../../../redux/store/backend/productServer.api';
import CircularLoader from '../../Loader/CircularLoader';

interface RecommendationsProps {
    productKey: string
}

export const Recommendations: React.FC<RecommendationsProps> = (props: RecommendationsProps) => {
    const recsQuery = useTop3CoProductsByProductApiKeyQuery({ key: props.productKey });

    if (recsQuery.isLoading) {
        return <CircularLoader />
    }

    return (
        <div className={`${styles.recs}`}>
            <h4>Рекомендуем к покупке</h4>
            <div className={`${styles.cardContainer}`}>
                {recsQuery.data?.map((product) => {
                    if (product === null) {
                        return null;
                    }
                    return <Card className={`${styles.card}`} sx={{ margin: '0 10px 15px' }}>
                        <CardContent className={`${styles.cardContent}`}>
                            <div>
                                <div className={`${styles.image}`}>
                                    <img src={`${product.images.header}`} />
                                </div>
                            </div>
                            <div>
                                <h6>{product.full_name}</h6>
                                <div>от {product.prices.price_min.amount} {product.prices.price_min.currency}</div>
                                <Button size="small" variant='text'>Предложений {product.prices.offers.count}</Button>
                            </div>
                        </CardContent>
                    </Card>
                })}
            </div>

        </div>

    );
}

export default Recommendations;