import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './login.module.css';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

import { login } from "../../../redux/slices/authSlice";
import { clearMessage } from "../../../redux/slices/messageSlice";
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginDTO } from '../../../redux/services/userService';
import { useAppDispatch } from '../../../redux/store/store';

export default function Login() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(event.currentTarget);
        event.preventDefault();
    };
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector((state: any) => state.auth);
    const { message } = useSelector((state: any) => state.message);

    const dispatch = useAppDispatch();

    //useEffect(() => {
    //    dispatch(clearMessage());
    //}, [dispatch]);


    const initialValues = {
        email: "",
        password: "",
    };

    if (isLoggedIn) {
        return <Navigate to="/" />;
    }

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginDto: LoginDTO = {
            email: data.get('email')?.toString() || "",
            password: data.get('password')?.toString() || ""
        }
        //setLoading(true);
        dispatch(login(loginDto))
            .unwrap()
            .then(() => {
                //navigate("/profile");
                window.location.href = '/profile';
            })
            .catch(() => {
                //setLoading(false);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid className={`${styles.login}`} item xs={12} sm={8} md={5} component={Paper} elevation={6} sx={{ height: '100vh' }} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Запомнить меня"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Забыли пароль?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Нет аккаунта? Зарегестрироваться!
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
        </ThemeProvider>
    );
}