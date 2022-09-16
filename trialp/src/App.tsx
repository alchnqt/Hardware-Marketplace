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

const Home = () => {
    return (<div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Wow <code>src/App.tsx</code> and save to reload.
            </p>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
        </header>
    </div>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
