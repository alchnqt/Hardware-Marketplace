import { Link } from '@mui/material';
import React from 'react';
import { SubCategory, SubSubCategory } from '../../../Models/Products/CategoriesType';
import { useCategoriesQuery } from '../../../redux/store/backend/productsServer.api';
import styles from './navbar.module.css';
function Navbar() {

    const { data, error, isLoading } = useCategoriesQuery(undefined);
    if (isLoading) {
        return <></>
    }
    else {
        return (
            <div className={`btn-group bg-primary ${styles.navbar} shadow-lg`} >
                {data?.main[0].subs.map((sub: SubCategory): any =>
                    <>
                        <button type="button" className={`${styles.btn} btn btn-primary dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                            {sub.subsName}
                            <span className={`${styles.image}`}>
                                <img height='45' src={`${sub.imageUrl}`} />
                            </span>
                        </button>
                        <ul className="dropdown-menu">
                            {sub.subssubs.map((subsub: SubSubCategory): any => <li><Link className="dropdown-item" href={`/products?subsubcategory=${subsub.apiCategory}`}>{subsub.name}</Link></li>)}
                        </ul>
                    </>
                )}
            </div>
        );
    }

}

export default Navbar;