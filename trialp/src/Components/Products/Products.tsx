import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useProductsQuery } from '../../redux/store/backend/external.api';
import { Product, ProductsResult } from '../../Models/Products/ProductType';

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    let subsubcategory: string = searchParams.get("subsubcategory") || "";
    const { data, error, isLoading } = useProductsQuery({ subsubcategory });
    if (isLoading) {
        return (
            <p></p>
        );
    }
    else if (error) {
        return (
            <p>Error</p>
        );
    }
    else {
        console.log(data);
        return (
            <div className={`container`}>
                {data.products.map((product: Product): any =>
                <div>
                    <img src={product.images.header}/>
                    <p>{product.full_name}</p>
                </div>)}
            </div>
        );
    }
    
}

export default Products;