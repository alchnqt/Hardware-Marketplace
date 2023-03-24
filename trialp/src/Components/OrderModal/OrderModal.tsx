import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';
import { EMAIL_CLAIM, ID_CLAIM } from '../../redux/slices/authSlice';
import styles from './ordermodal.module.css';
import { OrdersDto, usePostOrderMutation } from '../../redux/store/backend/ordersServer.api';
import React from 'react';
import { Box, Button } from '@mui/material';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export interface modalProps {
    order: OrdersDto
    cartCallback?: () => void
}

export default function OrderModal(props: modalProps) {
    const [postOrder, productResult] = usePostOrderMutation();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let modalContent: JSX.Element;

    if (productResult.isLoading) {
        modalContent = (<div>Происходит оформление заказа...</div>)
    }
    else {
        modalContent = (
            <div className={`${styles.orderModalBtns}`}>
                <Button variant="outlined" color="success" id="modal-modal-title" onClick={() => {
                    postOrder(props.order).unwrap().then((data: any) => {
                        if (props.cartCallback) {
                            props.cartCallback();
                        }
                        window.location.href = '/profile';
                    });
                }}>
                    Подтвердить заказ
                </Button>
                <Button variant="outlined" onClick={handleClose} color="error" id="modal-modal-description">
                    Отменить
                </Button>
            </div>
        );
    }

    return (
        <>
            <Button className={`${styles.buyNow} primary`} onClick={handleOpen} type="button">Купить сейчас</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component="div">
                    <div className={`${styles.orderModalContainer}`}>
                        <div className={`${styles.orderModalHeader}`}>
                            <h3>Оформление заказа</h3>
                        </div>
                        {modalContent}
                    </div>

                </Box>
            </Modal>
        </>
    );
}

