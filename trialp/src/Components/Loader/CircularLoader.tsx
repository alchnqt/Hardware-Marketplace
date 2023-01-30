import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import styles from './loader.module.css';

interface LoaderProps {
    content?: string
}

function CircularLoader({ content = ''}: LoaderProps) {
  return (
      <Box component="div" sx={{ display: 'flex' }} className={`${styles.loader}`}>
          <CircularProgress />
      </Box>
  );
}

export default CircularLoader;