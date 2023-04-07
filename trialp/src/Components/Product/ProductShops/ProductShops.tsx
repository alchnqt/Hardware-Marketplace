import { useSelector } from 'react-redux';
import { useProductQuery, useProductShopsQuery } from '../../../redux/store/backend/external.api';
import { useAppDispatch } from '../../../redux/store/store';
import CircularLoader from '../../Loader/CircularLoader';
import { addToCart, CartItem } from '../../../redux/slices/cartSlice';
import { PositionsPrimary, ProductShop } from '../../../Models/Products/ProductAllShop';
import { EMAIL_CLAIM, ID_CLAIM } from '../../../redux/slices/authSlice';
import OrderModal from '../../OrderModal/OrderModal';
import { Button, Link } from '@mui/material';
import { Product } from '../../../Models/Products/ProductType';
import { useParams } from 'react-router-dom';

import styles from '../product.module.css';

interface ProductShopMap {
    key: string,
    value: ProductShop
}

interface ShopProps{
    product: Product | undefined
}

export const ProductShops: React.FC<ShopProps> = (props: ShopProps) => {
    const { key } = useParams();
    const product = props.product;
    const shopQuery = useProductShopsQuery({ key: key });
    const dispatch = useAppDispatch();
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);

    const handleCart = (item: CartItem): void => {
        dispatch(addToCart(item))
    };

    if (shopQuery.isLoading && !key) {
        return (
            <CircularLoader />
        );
    }
    const array: ProductShopMap[] = [];
    if (shopQuery.data?.shops !== undefined) {
        Object.entries(shopQuery.data?.shops).forEach(
            ([key, value]) => array.push({ key, value })
        );
    }
    const copyPositionsPrimary: PositionsPrimary[] = [...shopQuery.data?.positions.primary || []];
    const sortedPP = [...copyPositionsPrimary.sort((a, b) => a.amount > b.amount ? 1 : -1)];
    return (
        <div className={`${styles.positionsPrimaryContainer}`}>
            {sortedPP.map(primary => {
                let x: ProductShopMap | undefined = array.find(obj => {
                    return parseInt(primary.shop_id) === obj.value.id
                });
                return <div key={x?.key}>
                    <div className={`${styles.prouduct}`}>
                        <div className={`${styles.element}`}>
                            <div className={`${styles.currency}`}>
                                <h2>{primary?.amount ?? (<span style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>Уточняйте у продавца</span>)} {primary?.currency}</h2>
                            </div>
                            <div className={`${styles.article}`}>
                                <p>{primary?.comment}</p>
                                <small>Импортер: {primary?.importer ?? (<span>Информация отсутствует</span>)}</small>
                            </div>
                            <div className={`${styles.buy}`}>
                                <div>
                                    {isLoggedIn && <OrderModal order={{
                                        userId: user[ID_CLAIM] || "",
                                        email: user[EMAIL_CLAIM] || "",
                                        orders: [`${primary?.dbId}`]
                                    }} />}

                                    <Button className={`${styles.toCart}`} onClick={() => {
                                        const item: CartItem = {
                                            id: `${product?.id || ""}${primary?.shop_id || ""}`,
                                            idDb: primary?.dbId || "",
                                            key: product?.id || "",
                                            shopId: primary?.shop_id || "",
                                            shopName: x?.value.title || "",
                                            title: product?.extended_name || "",
                                            image: product?.images.header || "",
                                            amount: primary?.amount || "",
                                            currency: primary?.currency || ""
                                        };
                                        handleCart(item)
                                    }} type="button">В корзину</Button>
                                </div>
                                <div>
                                    <img src={`${x?.value.logo}`} />
                                    <Link href={`/shop/${primary.shop_id}`}>{x?.value.title}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.borderLine}`}></div>
                </div>
            }
            )}
        </div>
    )
}
export default ProductShops;