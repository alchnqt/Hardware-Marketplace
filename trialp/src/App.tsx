import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './Components/Auth/Login/Login';
import Register from './Components/Auth/Register/Register';
import Profile from './Components/Auth/Profile/Profile';
import {
    Route,
    Router,
    Link,
    BrowserRouter,
    Routes,
    Outlet
} from "react-router-dom";

import { getAccessToken } from './Auth/AccessToken';
import { Home } from './Components/Home';
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
