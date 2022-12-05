import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import { EMAIL_CLAIM, NAME_CLAIM, PHONE_CLAIM, ROLE_CLAIM } from '../../../redux/slices/authSlice';
const Profile = () => {
    const { user } = useSelector((state: any) => state.auth);
    return (
        <Container>
            <div>
                <h1>Профиль пользователя</h1>
                <h3>Имя: {user[NAME_CLAIM]}</h3>
                <h3>Email: {user[EMAIL_CLAIM]}</h3>
                <h3>Телефон: {user[PHONE_CLAIM]}</h3>
            </div>
        </Container>
    );
}

export default Profile;