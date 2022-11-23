import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import styles from './footer.module.css';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright '}
            <Link color="inherit" href="https://mui.com/">
                © E-Katalog Inc.
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function StickyFooter() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
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
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body1">
                        My sticky footer can be found here.
                    </Typography>
                    <Copyright />
                </Container>
            </Box>
        </Box>
    );
}