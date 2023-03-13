import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Typography } from '@mui/material';
import styles from './breadcrumbs.module.css';

interface BreadcrumbsModel {
    title: string,
    id: string,
    link: string
}

function NavigateNextIcon() {
    return <Box component="span" color='black'>{'>'}</Box>
}

export default function ActiveLastBreadcrumb() {
    const paths = window.location.pathname.split('/').filter(i => i !== '');
    const breadcrumbs: BreadcrumbsModel[] = [];

    if(paths.length > 0){
        breadcrumbs.push({ title: `Главная`, id: 'Home', link: '/' });
    }

    paths.map((p, index): void => {
        if(p !== ''){
            breadcrumbs.push({
                title: `${p}`,
                id: `${p}`,
                link: `/${paths.slice(0, index + 1).join('/')}`
            })
        }
    })
    console.log(breadcrumbs);
    return (
        <div role="presentation" className={`${breadcrumbs.length !== 0 ? styles.breadcrumbsBox : ''}`}>
            <Breadcrumbs aria-label='breadcrumb' className={`${breadcrumbs.length === 1 ? styles.breadcrumbsMuiHide : ''}`} separator={<NavigateNextIcon />}>
                {breadcrumbs &&
                    breadcrumbs.map((b, index) =>
                        index !== breadcrumbs.length - 1 && b.id !== 'product' ? (
                            <div key={`breadcrumb${b.title}`}>
                                <Link underline='hover' className={`${styles.breadcrumb}`} href={b.link}>
                                    {b.title}
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
