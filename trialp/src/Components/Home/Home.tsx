import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.css';
import Carousel from './Carousel/Carousel';
import Navbar from './Navbar/Navbar';
export const Home = () => {
    return (
        <div className={`container ${styles.home}`}>
            <Navbar/>
            <Carousel/>
        </div>
    );
}