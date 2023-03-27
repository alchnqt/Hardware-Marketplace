import styles from './home.module.css';
import Carousel from './Carousel/Carousel';
import { Container } from '@mui/material';

function OverlayInfo() {
    let date = new Date().toLocaleDateString();
    return (
        <div className={styles.info}>
            <Container className={styles.intro} disableGutters maxWidth="sm" component="main" sx={{ pt: 3, pb: 3 }}>
                <h4 className={styles.description}>
                    Каталог товаров, сравнение, подбор, все цены интернет-магазинов.
                </h4>
            </Container>
            <a href="https://pmnd.rs/" target="_blank" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
                
                <br />
                E-Katalog
                <div>{date}</div>
            </a>
        </div>
    )
}

export const Home = () => {
    return (
        <div>
            <div className={`${styles.overlay}`}>
                <img src="/assets/models/images/blockchain-banner-homepage.jpg"/>
                <OverlayInfo />
            </div>
            <div className={`container ${styles.home}`}>
                <Carousel />
            </div>
        </div>
        
    );
}