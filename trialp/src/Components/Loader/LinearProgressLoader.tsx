import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';
import styles from './loader.module.css';

function CircularLoader() {
    return (
        <Box component="div" sx={{ display: 'flex' }} className={`${styles.loader}`}>
            <LinearProgress />
        </Box>
    );
}

export default CircularLoader;