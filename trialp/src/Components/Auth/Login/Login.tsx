import React, { useState } from 'react';
import { useLoginQuery } from '../../../redux/store/backend/identityServer.api';

interface LoginProps {
    userName: string,
    password: string
}

const Login: React.FC<LoginProps> = ({ userName, password }) => {

    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, isError, data } = useLoginQuery('');
    const renderErrorMessage = (name: string) => (
        <div className="error">{name}</div>
    );

    return (
        <form>
            <label>Логин </label>
            <input type="text" required />
            <label>Пароль </label>
            <input type="password" required />
        </form>
    );
}

export default Login;