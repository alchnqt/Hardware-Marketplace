import React, { useState } from 'react';
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
function Header() {
    const [show, setShow] = useState(false);
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
                        <Link className={`${styles.logo} `} href='/'>Company name</Link>
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
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Features
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
                    </nav>
                    <Button className={`${styles.loginBtn}`} onClick={() => setShow(prev => !prev)} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Войти
                    </Button>
                </Toolbar>
            </AppBar>
            {show && <Login />}
            <Navbar />
        </React.Fragment>
  );    
}

export default Header;