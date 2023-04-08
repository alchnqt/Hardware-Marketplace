import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Product } from '../../../Models/Products/ProductType';
import ProductShops from '../ProductShops/ProductShops';
import Reviews from '../Reviews/Reviews';
import { setPage } from '../../../redux/slices/reviewsSlice';
import { RootState, useAppDispatch } from '../../../redux/store/store';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }} component={'div'}>
                    <Typography component={'div'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface BasicTabsProps {
    product: Product | undefined
}

export default function BasicTabs(props: BasicTabsProps) {
    const [value, setValue] = React.useState(0);
    const product = props.product;
    
    const dispatch = useAppDispatch();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        dispatch(setPage())
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={`Предложения`} {...a11yProps(0)} />
                    <Tab label={`Отзывы (${product?.reviews.internalCount})`} {...a11yProps(1)} />
                    <Tab label={`Отзывы из интернета (${product?.reviews.externalCount})`} {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ProductShops product={product} />
            </TabPanel>
            <TabPanel value={value} index={1}>
            <Reviews 
                productKey={product?.key || ''} 
                productName={product?.full_name || ''}
                isSelf={true}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Reviews 
                productKey={product?.key || ''} 
                productName={product?.full_name || ''}
                isSelf={false}
                />
            </TabPanel>
        </Box>
    );
}