import { Container, Typography } from '@mui/material'
import React from 'react'

export const OurGoal = () => {
    return (
        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
            <Typography variant="h2" component="h1" gutterBottom>
                Наша задача
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                <p>Помочь покупателю быстро и удобно найти самое выгодное предложение.</p>
                <p>Для тех, кто определяется с выбором, в каждом разделе есть подбор по параметрам и возможность сравнить товары между собой.</p>
                <p>Доступен и удобный текстовый поиск, позволяющий искать как нужные разделы, так и конкретные товары по названию.</p>
                <p>А на странице каждой модели есть подробная информация, которая поможет принять решение: описание, технические характеристики, фото и видео, полезные ссылки и отзывы.</p>
                <p>Там же находится блок «Где купить?» со списком интернет-магазинов, ценами и прямыми ссылками на страницу покупки.</p>
            </Typography>
            <Typography variant="body1">Sticky footer placeholder.</Typography>
        </Container>
    )
}

export default OurGoal;