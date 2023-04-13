import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './layout.module.css';
const Layout = () => {
    return (
        <div className="layout">
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' }, a: { textDecoration: "none !important" } }} />
            <CssBaseline />
            <Header />
            <div className={`page ${styles.page}`}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;