import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const Layout = () => {
    return (
        <div className="layout">
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' }, a: { textDecoration: "none !important" }}} />
            <CssBaseline />
            <Header />
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default Layout;