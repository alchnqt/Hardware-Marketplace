export const DEFAULT_OCELOT_GATEWAY: string = 'https://localhost:7003/api';

interface Dictionary<T> {
    [Key: string]: T;
}
type Config = {
    endpoints: Dictionary<string>
};

export const CONFIG: Config = {
    endpoints: 
    {
        "auth": `${DEFAULT_OCELOT_GATEWAY}/identity/auth`,
        "products": `${DEFAULT_OCELOT_GATEWAY}/product/products`,
        "categories": `${DEFAULT_OCELOT_GATEWAY}/product/categories`,
        "apiSpoof": `${DEFAULT_OCELOT_GATEWAY}/product/apispoof`,
        "orders": `${DEFAULT_OCELOT_GATEWAY}/product/orders`,
    },
    
};

export const translatedComponentNames: Dictionary<string> = {
    "product": `продукт`,
    "profile": `профиль`,
    "history": `история`,
    "products": `продукты`
} 

function toUnicode(str: string) {
	return str.split('').map(function (value, index, array) {
		var temp = value.charCodeAt(0).toString(16).toUpperCase();
		if (temp.length > 2) {
			return '\\u' + temp;
		}
		return value;
	}).join('');
}

export const translateComponent = (name: string) => {
    let trnVal = translatedComponentNames[name];
    if(trnVal === undefined){
        return name;
    }
    else{
        return trnVal;
    }
}