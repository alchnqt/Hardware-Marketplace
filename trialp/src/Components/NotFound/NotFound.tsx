import { Container, Grid } from '@mui/material';
import React from 'react';
import styles from './notfound.module.css';

function NotFound() {
    return (
        <Container>
            <Grid className={`${styles.notfound}`} justifyContent='center' minHeight='600px'>
                <h1>Ошибка 404!</h1>
                <p>Такой страницы не существует.</p>
            </Grid>
            <hr />
        </Container>

    );
}

export default NotFound;