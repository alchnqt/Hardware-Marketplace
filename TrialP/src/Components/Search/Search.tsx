//@ts-nocheck
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import TextField from "@mui/material/TextField/TextField";
import React, { useState } from "react";
import styles from './search.module.css';
import { Product } from "../../Models/Products/ProductType";
import match from "./match";
import parse from "./parse";
function api<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json();
    })

}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const Search = () => {
  const [products, setProducts] = useState<Product[]>([]);

  return (<div className={`${styles.search}`}>
    <Autocomplete
      id="free-solo-demo"
      freeSolo
      onChange={(event: any, data: any) => {
        const product = data as Product;
        window.location.href = `/product/${product.key}`;
      }}
      onInputChange={(event, value) => {
        if (value.length > 1) {
          api<any>(`https://localhost:7003/api/product/search?name=${value}`)
            .then((data) => {
              console.log(data);
              setProducts(data as Product[]);
            })
            .catch(error => {

            })
        }
      }}
      getOptionLabel={(option) => (option as Product).extended_name}
      options={products.map((pr) => pr)}
      renderInput={(params) => <TextField {...params} label="Поиск товаров" />}

      renderOption={(props, option, { inputValue }) => {
        const matches: [number, number][] = match(option.extended_name, inputValue, { insideWords: true });
        const parts: { text: string; highlight: boolean; }[] = parse(option.extended_name, matches);
        props.className += ` ${styles.listElem}`;
        return (
          <li {...props}>
            <div className={`${styles.resultOption}`}>
              <img src={`${option.images.header}`} width={30} height={30} />
              <div>
                <div className={`${styles.text}`}>
                  {parts.map((part, index) => (
                    (<span key={index} style={{ fontWeight: part.highlight ? 700 : 400, }}>
                      {part.text}
                    </span>
                    )
                  ))}
                </div>
                <div className={`${styles.micro_description}`}>
                  <small>{option.micro_description}</small>
                </div>
              </div>
              <div className={`${styles.price}`}>
                <span>От</span>
                <span>{option.prices.price_min.amount}</span>
                <span>{option.prices.price_min.currency}</span>
              </div>
            </div>
          </li>
        );
      }} />
  </div>)
}

export default Search;
