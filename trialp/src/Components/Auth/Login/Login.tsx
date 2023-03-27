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

import { login } from "../../../redux/slices/authSlice";
import { useState } from 'react';
import { LoginDTO } from '../../../redux/services/userService';
import { store, useAppDispatch } from '../../../redux/store/store';
import Copyright from '../../Copyright/Copyright';
import Navigate from '../../CustomComponents/Navigate';
const theme = createTheme();

export default function Login() {

    const dispatch = useAppDispatch();

    const [errorMsg, setErrorMsg] = useState<string>('');

    if(store.getState().auth.isLoggedIn){
        return <Navigate to={'/profile'}/>
    }


    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginDto: LoginDTO = {
            email: data.get('email')?.toString() || "",
            password: data.get('password')?.toString() || ""
        }
        const loginRes = await dispatch(login(loginDto)).unwrap();
        //console.log(loginRes);
        if(loginRes.accessToken === '' && loginRes.user == null){
            setErrorMsg(loginRes.message)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid className={`${styles.login}`} item xs={12} sm={8} md={5} component={Paper} elevation={6} sx={{ height: '100vh' }} square>
                <Box component="div"
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
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
                        {errorMsg !== '' ? (<div style={{color: 'red'}}>
                            {errorMsg}
                        </div>) : null}
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
                                <Link href="/register" variant="body2">
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