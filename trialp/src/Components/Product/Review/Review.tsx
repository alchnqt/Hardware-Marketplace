import { Rating } from '@mui/material';
import React from 'react'

export const Review = (product: string) => {
    const [rating, setRating] = React.useState<number | null>(0);

    return (
        <div>
            <h3>Отзыв о: {product}</h3>
            <strong>Представьтесь, пожалуйста</strong>
            <input type='text' />
            <strong>Расскажите подробно о ваших впечатлениях</strong>
            <small>Почему вы решили купить этот товар? Что вам особенно понравилось и что не понравилось?</small>
            <div>
                <div>Ваша оценка</div>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                />
            </div>
        </div>
    )
}
