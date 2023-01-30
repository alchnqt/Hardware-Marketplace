import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import { EMAIL_CLAIM, ID_CLAIM, NAME_CLAIM, PHONE_CLAIM, ROLE_CLAIM } from '../../../redux/slices/authSlice';
import { useUserOrdersQuery } from '../../../redux/store/backend/external.api';
import CircularLoader from '../../Loader/CircularLoader';
import Order from '../../Order/Order';
const Profile = () => {
    const { user } = useSelector((state: any) => state.auth);
    let userId: string = user[ID_CLAIM];
    return (
        <Container>
            <div>
                <h1>Профиль пользователя</h1>
                <h3>Имя: {user[NAME_CLAIM]}</h3>
                <h3>Email: {user[EMAIL_CLAIM]}</h3>
                <h3>Телефон: {user[PHONE_CLAIM]}</h3>
            </div>
            <br />
            <br />
            <Order isCompleted={false} userId={userId} />
        </Container>
    );
}

export default Profile;