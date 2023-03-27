import { Dictionary } from '@reduxjs/toolkit';
import React from 'react';
import { useParams } from 'react-router-dom';
import { toNormalHours, toNormalTime, translateDays } from '../../App_Data/configuration';
import { useShopQuery } from '../../redux/store/backend/external.api';
import CircularLoader from '../Loader/CircularLoader';
import styles from './shop.module.css';


export const Shop = () => {
    const { id } = useParams();
    const result = useShopQuery({ id: Number(id) });
    if (result.isLoading) {
        return (
            <CircularLoader />
        );
    }
    else if (result.isError) {
        return (
            <p>Error</p>
        );
    }
    else {
        return <div className='container'>
            <div className={`${styles.shopLogo}`}><img src={`${result.data?.logo}`} /></div>
            <div>
                {result.data?.order_processing.schedule !== undefined ?
                    <div className={`${styles.shopAddInfo}`}>
                        <h3>Режим обработки заказов</h3>
                        <div className={`${styles.timeTable}`}>
                            {Object.entries(result.data?.order_processing.schedule).map(
                                ([key, value]) => 
                                <div key={`tt${key}`} className={`${styles.timeTableRow}`}>
                                    <div>{translateDays(key)}:</div><div>{toNormalHours(value.from)} - {toNormalHours(value.till)}</div>
                                </div>)}
                        </div>
                    </div> : null
                }

                <div className={`${styles.shopAddInfo}`}>
                    <h3>{result.data?.customer.title}</h3>
                    <div>{result.data?.customer.address}</div>
                    <div>Регистрирующий орган: {result.data?.customer.registration_agency}</div>
                    {result.data?.customer.registration_date !== undefined ?
                        <div>Зарегистрирован в торговом реестре: {toNormalTime(result.data?.customer.registration_date)}</div>

                        : null}

                </div>

                <div className={`${styles.shopAddInfo}`}>
                    {result.data?.order_processing.schedule !== undefined ?
                        <div>
                            <h3>Способы оплаты</h3>
                            {Object.entries(result.data?.payment_methods).map(
                                ([key, value]) => 
                                <div key={`pm${key}`}>
                                    <div>{value}</div>
                                </div>)}
                        </div> : null
                    }
                </div>
            </div>
        </div>
    }
};

export default Shop;