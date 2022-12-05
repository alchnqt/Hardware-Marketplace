import React, { useState, useCallback, useEffect } from 'react';
import Link from '@mui/material/Link';
import styles from './header.module.css';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import Register from '../Auth/Register/Register';
import Login from '../Auth/Login/Login';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Navbar from '../Home/Navbar/Navbar';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store/store';
import { logout, ROLE_CLAIM } from '../../redux/slices/authSlice';
import EventBus from '../../redux/common/EventBus';

function Header() {
    const [show, setShow] = useState(false);
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    const { cart } = useSelector((state: RootState) => state.cart);

    const getTotalQuantity = () => {
        let total = 0;
        for (let item of cart) {
            total += (item as any).quantity
        }
        return total;
    }

    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();
    const isAdmin: boolean = currentUser ? currentUser[ROLE_CLAIM] == 'Admin' : false;
    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    //useEffect(() => {
    //    if (currentUser) {
    //        setShowAdminBoard(currentUser.roles.includes("Admin"));
    //    } else {
    //        setShowAdminBoard(false);
    //    }

    //    EventBus.on("logout", () => {
    //        logOut();
    //    });

    //    return () => {
    //        EventBus.remove("logout", undefined);
    //    };
    //}, [currentUser, logOut]);

    return (
        <React.Fragment>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                <Toolbar className={`${styles.header}`} sx={{ flexWrap: 'no-wrap' }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        <Link className={`${styles.logo} `} href='/'>E-Katalog</Link>
                    </Typography>
                    <TextField
                        className={`${styles.search}`}
                        autoComplete="given-name"
                        name="search"
                        fullWidth
                        id="search"
                        label="Поиск"
                        autoFocus
                    />
                    <nav>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="/cart"
                            sx={{ my: 1, mx: 1.5 }}>
                            Избранное: {getTotalQuantity()}
                        </Link>
                        
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Enterprise
                        </Link>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Поддержка
                        </Link>
                        {
                            isAdmin && isLoggedIn &&
                            <>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/admin"
                                sx={{ my: 1, mx: 1.5 }}>
                                Админ
                            </Link>
                            </>
                        }
                        {isLoggedIn &&
                            <>
                                <Link
                                    variant="button"
                                    color="text.primary"
                                    href="/profile"
                                    sx={{ my: 1, mx: 1.5 }}
                                >
                                    Профиль
                            </Link>

                                <Button
                                    onClick={() => logOut()}
                                    variant="outlined"
                                    sx={{ my: 1, mx: 1.5 }}>
                                    Выйти
                                </Button>
                            </>
                        }
                    </nav>
                    {!isLoggedIn &&
                        <Button className={`${styles.loginBtn}`} onClick={() => setShow(prev => !prev)} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                            Войти
                        </Button>
                    }
                </Toolbar>
            </AppBar>
            {show && <Login />}
            <Navbar />
        </React.Fragment>
    );
}

export default Header;