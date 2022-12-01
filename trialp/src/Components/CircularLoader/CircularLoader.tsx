import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import styles from './circularloader.module.css';

function CircularLoader() {
  return (
      <Box sx={{ display: 'flex' }} className={`${styles.loader}`}>
          <CircularProgress />
      </Box>
  );
}

export default CircularLoader;