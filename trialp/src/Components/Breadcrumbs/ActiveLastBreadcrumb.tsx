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
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsModel[]>([]);

    //products page
    const [productPage, setProductPage] = useState<{ current: number, last: number }>({ current: 0, last: 0 });

    //product page
    const [productName, setProductName] = useState<string>('');

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if(loaded){
            return;
        }
        let brArr: BreadcrumbsModel[] = [];
        const paths = window.location.pathname.split('/').filter(i => i !== '');
        if (paths.length > 0) {
            brArr.push({ title: `Главная`, id: 'Home', link: '/' });
        }
        brArr = [...brArr, ...paths.map((p, index) => {
            if (p !== '') {
                return {
                    title: `${translateComponent(p)}`,
                    id: `${p}`,
                    link: `/${paths.slice(0, index + 1).join('/')}`
                }
            }
        }) as BreadcrumbsModel[]];

        if (brArr.length === 2 &&
            brArr.some(s => s.id === 'products')
        ) {
            brArr.push({
                title: `Страница ${productPage.current} из ${productPage.last}`,
                id: `prnamepage${productPage.current}`,
                link: ``
            })
        }
        //products page
        if (brArr.length > 2 && brArr.some(s => s.id === 'product')) {
            brArr[2] = {
                title: `${productName}`,
                id: `prname${productName}`,
                link: ``
            }
        }
        setBreadcrumbs(brArr);
        setLoaded(true);
    }, [breadcrumbs, loaded, productName, productPage]);

    store.subscribe(() => {
        setLoaded(false);
        setProductName(store.getState().product.product?.name || '');
        setProductPage(store.getState().product.apiPage);
    })

    return (
        <div role="presentation" className={`${breadcrumbs.length !== 0 ? styles.breadcrumbsBox : ''}`}>
            <Breadcrumbs aria-label='breadcrumb' className={`${breadcrumbs.length === 1 ? styles.breadcrumbsMuiHide : ''}`} separator={<NavigateNextIcon />}>
                {breadcrumbs &&
                    breadcrumbs.map((b, index) =>
                        index !== breadcrumbs.length - 1 && b.id.toLowerCase().indexOf("product") === -1 ? (
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
