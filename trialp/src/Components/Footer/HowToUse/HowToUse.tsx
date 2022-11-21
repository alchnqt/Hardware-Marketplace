import React from 'react';
import styles from './howtouse.module.css';
function HowToUse() {
    return (
        <div className={`container`} style={{ padding: '25px 0 0 0'}}>
            <h2 className={`${styles.how}`}>Как пользоваться сайтом?</h2>
            <div className={`${styles.about}`}>
                <p>E-Katalog — многофункциональный сервис поиска товаров в интернет-магазинах и сравнения цен. Он охватывает самые разнообразные категории товаров: электроника, компьютеры, бытовая техника, автотовары, оборудование для ремонта и строительства, туристическое снаряжение, детские товары и многое другое.</p>
                <p>Наша задача - помочь покупателю быстро и удобно найти самое выгодное предложение. Для тех, кто определяется с выбором, в каждом разделе есть подбор по параметрам и возможность сравнить товары между собой. Доступен и удобный текстовый поиск, позволяющий искать как нужные разделы, так и конкретные товары по названию. А на странице каждой модели есть подробная информация, которая поможет принять решение: описание, технические характеристики, фото и видео, полезные ссылки и отзывы. Там же находится блок «Где купить?» со списком интернет-магазинов, ценами и прямыми ссылками на страницу покупки.</p>
                <p>К системе E-Katalog подключено более 1000 магазинов, данные по которым постоянно обновляются. Благодаря этому вы сможете не только выбрать подходящий товар, но и купить его по самым выгодным условиям!</p>
            </div>
        </div>
    );
}

export default HowToUse;