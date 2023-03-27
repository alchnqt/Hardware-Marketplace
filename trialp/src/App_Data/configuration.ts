export const DEFAULT_OCELOT_GATEWAY: string = 'http://rhino.acme.com:5003/api';

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
    "product": `товар`,
    "profile": `профиль`,
    "history": `история`,
    "products": `товары`,
    "shop": `магазин`
} 

export const translatedDays: Dictionary<string> = {
    "monday": `Понедельник`,
    "tuesday": `Вторник`,
    "wednesday": `Среда`,
    "thursday": `Четверг`,
    "friday": `Пятница`,
    "saturday": `Суббота`,
    "sunday": `Воскресенье`
} 

export const translateDays = (key: string) => {
    return translatedDays[key];
}

export const toNormalHours = (key: string) => {
    const normalH = key.substring(0, key.indexOf('+'));
    return normalH;
}

export const toNormalTime = (key: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(key);
    return date.toLocaleDateString('ru-RU', options);
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