import { Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { ID_CLAIM } from '../../redux/slices/authSlice';
import Order from '../Order/Order';

function HistoryOrder() {
    const { user } = useSelector((state: any) => state.auth);
    let userId: string = user[ID_CLAIM];
    return (
        <Container>
            <Order isCompleted={true} userId={userId} />
        </Container>
    );
}

export default HistoryOrder;