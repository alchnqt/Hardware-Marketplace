import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useProductsQuery } from '../../redux/store/backend/external.api';
import { Product, ProductsResult } from '../../Models/Products/ProductType';
import styles from './products.module.css';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Container } from '@mui/material';
function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    let subsubcategory: string = searchParams.get("subsubcategory") || "";
    const { data, error, isLoading } = useProductsQuery({ subsubcategory });
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex' }} className={`${styles.loader}`}>
                <CircularProgress />
            </Box>
        );
    }
    else if (error) {
        return (
            <p>Error</p>
        );
    }
    else {
        console.log(data);
        return (
            <div className={`container ${styles.container}`}>
                {data.products.map((product: Product): any =>
                    <>
                        <div className={`${styles.product}`}>
                            <img className={`${styles.icon}`} src={product.images.header} />
                            <div className={`${styles.secondBlock}`}>
                                <p className={`${styles.name}`}>{product.full_name}</p>
                                <div className={`${styles.description}`}>{product.description}</div>
                            </div>
                            <div className={`${styles.price}`}>
                                от {product.prices.price_min.amount} {product.prices.price_min.currency}
                            </div>
                            <div className={`${styles.buy}`}>
                                <Link
                                    href={`${product.html_url}`}
                                    className={`${styles.buyBtn}`}
                                    sx={{ mt: 3, mb: 2 }}>
                                    {`Предложений ${product.prices.offers.count}`}
                                </Link>
                            </div>
                        </div>
                        <Divider className={`${styles.dividerProduct}`}></Divider>
                    </>
                )}
                <div>
                    <Divider className={`${styles.divider}`}></Divider>
                    <Button
                        fullWidth
                        className={`${styles.nextBtn}`}
                    >
                        {`Следующие ${data.page.limit} товаров`}
                    </Button>
                </div>
            </div>
        );
    }

}

export default Products;