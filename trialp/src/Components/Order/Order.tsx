import React from 'react';
import { useSelector } from 'react-redux';
import { ID_CLAIM } from '../../redux/slices/authSlice';
import { useUserOrdersQuery } from '../../redux/store/backend/external.api';
import { OrdersDto } from '../../redux/store/backend/ordersServer.api';
import CircularLoader from '../CircularLoader/CircularLoader';

interface OrderProps {
    userId: string
    isCompleted: boolean
}

function Order(props: OrderProps) {
    const { user } = useSelector((state: any) => state.auth);
    const { data, error, isLoading } = useUserOrdersQuery({ key: props.userId, isCompleted: props.isCompleted });

    if (isLoading) {
        return <CircularLoader />
    }
    if (error) {
        return <>Error</>
    }
    return (
        <>
            <h3>{props.isCompleted ? `История заказов: ` : `Действующие заказы: `}</h3>
            <hr />
            {data?.orders.map(x => {
                return (
                    <div key={x.key}>
                        <h4>Количество товаров: {x.count} на сумму {x.amount} BYN</h4>
                        <ul>
                            {x.positionsPrimary.map(ppv => {
                                return (
                                    <li key={ppv.positionsPrimaryValue.positionsPrimary.id}>
                                        <span>
                                            {ppv.positionsPrimaryValue.product.full_name} - {ppv.positionsPrimaryValue.positionsPrimary.amount} BYN x {ppv.count}
                                        </span>
                                    </li>)
                            })}
                        </ul>
                        <hr />
                    </div>)
            })}
        </>
    );
}

export default Order;