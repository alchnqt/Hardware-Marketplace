import { Button, Rating, TextField } from '@mui/material';
import React, { useState } from 'react'
import styles from './review.module.css';
import { useCreateReviewMutation } from '../../../redux/store/backend/external.api';
import { CreateReview } from '../../../Models/Reviews/ProductReviews';
import CircularLoader from '../../Loader/CircularLoader';
interface ReviewProps {
    productName: string,
    userId: string,
    apiProductId: string,
    productId: string
}

export const Review: React.FC<ReviewProps> = (props: ReviewProps) => {
    const [rating, setRating] = useState<number | null>(0);
    const [text, setText] = useState<string>('');
    const [pros, setPros] = useState<string>('');
    const [cons, setCons] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [summary, setSummary] = useState<string>('');


    const { productName } = props;
    const [createReview, isLoading] = useCreateReviewMutation();

    const submitReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const review: CreateReview = {
            author: JSON.stringify({ name: userName }),
            text: text,
            pros: pros,
            cons: cons,
            rating: rating || 0,
            userId: props.userId,
            apiProductId: props.apiProductId,
            productId: props.productId,
            summary: summary
        };
        createReview(review);
    };

    if(isLoading){
        <CircularLoader />
    }

    return (
        <form className={`${styles.review}`} onSubmit={(e) => submitReview(e)}>
            <div className={`${styles.name}`}>
                <h3>Отзыв о: {productName}</h3>
                <strong>Представьтесь, пожалуйста</strong>
                <TextField
                    required
                    id="outlined-required"
                    placeholder="Ваше имя"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <strong>Расскажите подробно о ваших впечатлениях</strong>
            <small>Почему вы решили купить этот товар? Что вам особенно понравилось и что не понравилось?</small>
            <div className={`${styles.reviewInputs}`}>
                <h6>Ваша оценка</h6>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                />
            </div>
            <h6>Ваш отзыв</h6>
            <TextField
                required
                id="filled-multiline-flexible"
                placeholder="Обратите внимание на качество, удобство, соответствие заявленным характеристикам и т. д."
                multiline
                minRows={5}
                maxRows={20}
                onChange={(e) => setText(e.target.value)}
            />
            <h6>Подытожьте ваш отзыв (заголовок)</h6>
            <TextField
                required
                id="outlined-required"
                placeholder="Будет использоваться в качестве заголовка"
                onChange={(e) => setSummary(e.target.value)}
            />

            <div className={`${styles.proscons}`}>
                <strong>Достоинства и недостатки</strong>
                <small>Напишите самые главные достоинства и недостатки товара — это поможет другим покупателям определиться с выбором</small>
                <h6>Достоинства </h6>
                <TextField
                    required
                    id="filled-multiline-flexible2"
                    placeholder="Что понравилось"
                    multiline
                    color="success"
                    minRows={2}
                    maxRows={20}
                    onChange={(e) => setPros(e.target.value)}
                />

                <h6>Недостатки </h6>
                <TextField
                    required
                    id="filled-multiline-flexible3"
                    color='error'
                    placeholder="Что не понравилось"
                    multiline
                    minRows={2}
                    maxRows={20}
                    onChange={(e) => setCons(e.target.value)}
                />
            </div>
            <Button variant='outlined' type='submit'>Отправить отзыв</Button>
        </form>
    )
}

export default Review;
