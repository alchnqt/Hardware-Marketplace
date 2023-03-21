import React, { useEffect, useState } from 'react';
import { RootState, useAppDispatch } from '../../redux/store/store';
import { productThunks } from '../../redux/thunks/productThunks';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Typography } from '@mui/material';
import styles from './breadcrumbs.module.css';
import { store } from '../../redux/store/store';
import { selectCurrentProduct } from '../../redux/slices/productsSlice';
import { useParams } from 'react-router-dom';
import { Product } from '../../Models/Products/ProductType';
import { translateComponent, translatedComponentNames } from '../../App_Data/configuration';

interface BreadcrumbsModel {
    title: string,
    id: string,
    link: string
}

function NavigateNextIcon() {
    return <Box component="span" color='black'>{'>'}</Box>
}

const createTitle = (title: string) => {
    return { __html: title }
}

export default function ActiveLastBreadcrumb() {
    const paths = window.location.pathname.split('/').filter(i => i !== '');
    const breadcrumbs: BreadcrumbsModel[] = [];

    if (paths.length > 0) {
        breadcrumbs.push({ title: `Главная`, id: 'Home', link: '/' });
    }


    const [productPage, setProductPage] = useState<{ current: number, last: number }>({ current: 0, last: 0 });

    paths.map((p, index): void => {
        if (p !== '') {
            breadcrumbs.push({
                title: `${translateComponent(p)}`,
                id: `${p}`,
                link: `/${paths.slice(0, index + 1).join('/')}`
            })

            
        }
    });

    //productPage
    if (breadcrumbs.length === 2 &&
        breadcrumbs.some(s => s.id === 'products')
    ) {
        breadcrumbs.push({
            title: `Страница ${productPage.current} из ${productPage.last}`,
            id: `prnamepage${productPage.current}`,
            link: ``
        })
    }

    if (breadcrumbs.length > 2) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [pr, setPr] = useState<string>('');
        store.subscribe(() => {
            setPr(store.getState().product.product?.name || '')
        })
        breadcrumbs[2] = {
            title: `${pr}`,
            id: `prname${pr}`,
            link: ``
        }
    }
    return (
        <div role="presentation" className={`${breadcrumbs.length !== 0 ? styles.breadcrumbsBox : ''}`}>
            <Breadcrumbs aria-label='breadcrumb' className={`${breadcrumbs.length === 1 ? styles.breadcrumbsMuiHide : ''}`} separator={<NavigateNextIcon />}>
                {breadcrumbs &&
                    breadcrumbs.map((b, index) =>
                        index !== breadcrumbs.length - 1 && b.id !== 'product' ? (
                            <div key={`breadcrumb${b.title}`}>
                                <Link underline='hover' className={`${styles.breadcrumb}`} href={b.link}>
                                    <div dangerouslySetInnerHTML={createTitle(b.title)}></div>
                                </Link>
                            </div>
                        ) : (
                            <Typography key={`breadcrumb${b.title}`} className={`${styles.breadcrumbNoLink}`}>
                                {b.title}
                            </Typography>
                        ),
                    )}
            </Breadcrumbs>
        </div>
    );
}
