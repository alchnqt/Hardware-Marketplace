import React from 'react';
import {
    Route,
    Router,
    Link,
    BrowserRouter,
    Routes,
    Outlet
} from "react-router-dom";

import Login from './../../Components/Auth/Login/Login';
import Register from './../../Components/Auth/Register/Register';
import Profile from './../../Components/Auth/Profile/Profile';
import { getAccessToken } from './../../Auth/AccessToken';
import { Home } from './../../Components/Home/Home';
import Layout from '../Layout/Layout';

function AppRouter() {
  return (
      <Routes>
          <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
          </Route>
      </Routes>
  );
}

export default AppRouter;