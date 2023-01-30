import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useProductsQuery } from '../../redux/store/backend/external.api';
import { Product, ProductsResult } from '../../Models/Products/ProductType';
import styles from './products.module.css';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import CircularLoader from '../Loader/CircularLoader';
import { RootState, useAppDispatch } from '../../redux/store/store';
import { decrementPage, incrementPage } from '../../redux/slices/productsSlice';

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { page } = useSelector((state: RootState) => state.product);
    const dispatch = useAppDispatch();
    let subsubcategory: string = searchParams.get("subsubcategory") || "";
    const { data, error, isLoading } = useProductsQuery({ subsubcategory, page });

    if (isLoading) {
        return (
            <CircularLoader />
        );
    }
    else if (error) {
        return (
            <p>Error</p>
        );
    }
    else {
        return (
            <div className={`container ${styles.container}`}>
                {page > 1 && (
                    <Button
                        fullWidth
                        className={`${styles.prevBtnTop}`}
                        onClick={() => { dispatch(decrementPage(undefined)) }}>
                        <span>{`<< Вернуться`}</span>
                    </Button>)}
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
                                    href={`/product/${product.key}`}
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
                        onClick={() => { dispatch(incrementPage(undefined)) }}>
                        {`Следующие ${data.page.limit} товаров`}
                    </Button>
                    <Divider className={`${styles.divider}`}></Divider>
                    {page > 1 && (
                        <Button
                            fullWidth
                            className={`${styles.nextBtn}`}
                            onClick={() => { dispatch(decrementPage(undefined)) }}>
                            {`Вернуться`}
                        </Button>)}
                </div>
            </div>
        );
    }

}

export default Products;