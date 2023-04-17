import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useTop3SoldQuery } from '../../../redux/store/backend/productServer.api';
import CircularLoader from '../../Loader/CircularLoader';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const tiers = [
    {
        title: 'Free',
        price: '0',
        description: [
            '10 users included',
            '2 GB of storage',
            'Help center access',
            'Email support',
        ],
        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
    },
    {
        title: 'Pro',
        subheader: 'Most popular',
        price: '15',
        description: [
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Get started',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '30',
        description: [
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
];

function PricingContent() {
    let top3SoldRes = useTop3SoldQuery();
    if (top3SoldRes.isError || top3SoldRes.isLoading) {
        return <CircularLoader />
    }
    let arr = [...top3SoldRes?.data || []];

    arr = arr.sort((a, b) => b.product.microdescription.length - a.product.microdescription.length);
    [arr[0], arr[1]] = [arr[1], arr[0]];
    return (
        <React.Fragment>

            {/* Hero unit */}
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 3, pb: 3 }}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    gutterBottom
                >
                    E-Katalog
                </Typography>
                <Typography variant="h5" align="center" component="p">
                    Это многофункциональный сервис поиска товаров в интернет-магазинах и сравнения цен.
                    Он охватывает самые разнообразные категории товаров: электроника, готовые сборки, ОЗУ, видеокарты, процессоры, 
                    сетевое оборудование, мультимедиа,
                    аксессуары: рюкзаки, сумки, подставки для ноутбуков.
                </Typography>
            </Container>
            <hr />
            <Container maxWidth="md" component="main">
                <h3 style={{textAlign: 'center'}}>Топ продаж</h3>
                <Grid container spacing={5} alignItems="flex-end">
                    {arr.map((res, index) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid
                            item
                            key={`top3product${res.key}`}
                            xs={12}
                            sm={index === 2 ? 12 : 6}
                            md={4}
                        >
                            <Card>
                                <CardHeader
                                    title={res.product.name}
                                    titleTypographyProps={{ align: 'center' }}
                                    action={index === 1 ? <StarIcon /> : null}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }}
                                />
                                <CardContent>
                                    <Box component="div"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <img src={`${res.product.images.header}`} width={'50%'} height={'50%'} />
                                    </Box>
                                    <Box component="div"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography component="h2" variant="h4" color="text.primary">
                                            От {res.product.amount} {res.product.currency}
                                        </Typography>
                                    </Box>
                                    <Box component="div"
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        {res.product.microdescription}
                                    </Box>

                                </CardContent>
                                <CardActions
                                    sx={{
                                        display: 'block'
                                    }}
                                >
                                    <Box component="div"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Link
                                            sx={{
                                                textAlign: 'center'
                                            }}
                                            href={`/product/${res.product.apiKey}`}
                                        >
                                            Посмотреть предложения
                                        </Link>
                                    </Box>

                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <hr />
        </React.Fragment>
    );
}

export default function Carousel() {
    return <PricingContent />;
}