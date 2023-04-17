import styles from './home.module.css';
import Carousel from './Carousel/Carousel';
import { Container } from '@mui/material';
import OurGoal from '../Footer/OurGoal/OurGoal';
import { useTop3SoldQuery } from '../../redux/store/backend/productServer.api';

function OverlayInfo() {
    let date = new Date().toLocaleDateString();
    return (
        <div className={styles.info}>
            <Container className={styles.intro} disableGutters maxWidth="sm" component="main" sx={{ pt: 3, pb: 3 }}>
                <h4 className={styles.description}>
                    Каталог товаров, подбор, все цены интернет-магазинов компьютерной техники.
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
                <OurGoal />
            </div>
        </div>
        
    );
}