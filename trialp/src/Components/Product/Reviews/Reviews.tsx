import React from 'react'
import { useReviewsQuery } from '../../../redux/store/backend/external.api';
import CircularLoader from '../../Loader/CircularLoader';
import { Button, Divider, Rating } from '@mui/material';
import styles from './reviews.module.css';
import { toNormalTimeWithHours } from '../../../App_Data/configuration';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store/store';
import { decrementPage, incrementPage, setPage } from '../../../redux/slices/reviewsSlice';
import { store } from '../../../redux/store/store';
interface ReviewsProps {
    productKey: string,
    productName: string,
    isSelf: boolean
}


export const Reviews: React.FC<ReviewsProps> = (props: ReviewsProps) => {
    const { productKey, productName } = props;
    const { page } = useSelector((state: RootState) => state.review);
    const reviewsQuery = useReviewsQuery({ key: productKey, page: page, isSelf: props.isSelf });
    const dispatch = useAppDispatch();
    if (reviewsQuery.isLoading) {
        return (
            <CircularLoader />
        );
    }

    if (reviewsQuery.isError) {
        return (
            <CircularLoader />
        );
    }

    return (
        <div className={`${styles.reviewsContainer}`}>
            {(reviewsQuery.data?.reviews.length || 0) > 9 ?
                <div>
                    <div>Страница {store.getState().review.apiPage.current} из {reviewsQuery.data?.page.last}</div>
                    <hr />
                </div>
                : null}
            {reviewsQuery.data?.reviews.map((review) =>
                <div key={`reviewid${review.dbId}}`} className={`${styles.review}`}>
                    <div>
                        <Rating
                            name="read-only"
                            value={(review.rating)} readOnly />
                    </div>
                    <small>{`Отзыв о `}{productName}</small>
                    <h4>{review.summary}</h4>
                    <p>{review.text}</p>
                    <div className={`${styles.pros}`}><span>{`Достоинства: `}</span>{review.pros}</div>
                    <div className={`${styles.cons}`}><span>{`Недостатки: `}</span>{review.cons}</div>
                    {review.userId === null ?
                        <div className={`${styles.author}`}>
                            <div>{review.author?.name}</div>
                            <small>{toNormalTimeWithHours(review.created_at)}</small>
                        </div>
                        : null}
                    <hr />
                </div>)}
            <div>
                {reviewsQuery.data?.page.current !== reviewsQuery.data?.page.last
                    && (reviewsQuery.data?.reviews.length || 0) > 9 ?
                    <div>
                        <Divider className={`${styles.divider}`}></Divider>
                        <Button
                            fullWidth
                            className={`${styles.nextBtn}`}
                            onClick={() => { dispatch(incrementPage(undefined)) }}>
                            {`Следующие отзывы`}
                        </Button>
                    </div> : null}

                <Divider className={`${styles.divider}`}></Divider>
                {store.getState().review.apiPage.current > 1 && (
                    <Button
                        fullWidth
                        className={`${styles.nextBtn}`}
                        onClick={() => { dispatch(decrementPage(undefined)) }}>
                        {`Вернуться`}
                    </Button>)}
            </div>
        </div>
    )
}

export default Reviews;