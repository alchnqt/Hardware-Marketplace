import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RegisterDto, useRegisterMutation } from '../../../redux/store/backend/identityServer.api';
import Copyright from '../../Copyright/Copyright';
import { useAppDispatch } from '../../../redux/store/store';
import { LoginDTO } from '../../../redux/services/userService';
import { login } from '../../../redux/slices/authSlice';
import styles from './register.module.css';

const theme = createTheme();

interface Rsp {
    text: string,
    color: string,
    show: boolean
}

export default function Register() {
    const [register, result] = useRegisterMutation();

    const [respMsg, setRespMsg] = React.useState({text: '', color: '', show: false} as Rsp);

    const dispatch = useAppDispatch();

    const handleLogin = (email: string, password: string): void => {
        const loginDto: LoginDTO = {
            email: email,
            password: password
        }
        dispatch(login(loginDto))
            .unwrap()
            .then(() => {
                window.location.href = '/profile';
            })
            .catch(() => {
            });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const regDto: RegisterDto = {
            email: data.get('email')?.toString() || "",
            password: data.get('password')?.toString() || "",
            phone: data.get('phone')?.toString() || "",
            username: data.get('username')?.toString() || "",
            repeatPassword: data.get('repeatPassword')?.toString() || ""
        };
        register(regDto);
    };

    //console.log(isRegisterSuccess)

    if (result.isSuccess) {
        return (
            <Container component="main" className={`${styles.successMsg}`}>
                <Box sx={{ color: `success.main` }}><h3>Регистрация прошла успешно</h3></Box>
            </Container>
        )
    }
    else {
        console.log(result.error)
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Регистрация
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="username"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Юзернейм"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Телефон"
                                        name="phone"
                                        autoComplete="phone"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Пароль"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="repeatPassword"
                                        label="Повторите пароль"
                                        type="password"
                                        id="repeatPassword"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Зарегистрироваться
                            </Button>
                        </Box>
                    </Box>
                    {result.isError && !result.isLoading && (<Box sx={{ color: `error.main` }}>Ошибка регистрации, проверьте данные. {`${(result.error as any).data.message}`}</Box>)}
                    <Copyright sx={{ mt: 5 }} />
                </Container>
            </ThemeProvider>
        );
    }
    
}