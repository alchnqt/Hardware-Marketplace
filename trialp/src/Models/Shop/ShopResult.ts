export default interface ShopResult{
    id: number,
    registration_date: string,
    title: string,
    logo: string,
    payment_methods: {
        [key: string]: string;
    },
    customer: {
        title: string,
        address: string,
        registration_date: string,
        registration_agency: string
    },
    order_processing:{
        schedule:{
            [key: string]: {
                from: string,
                till: string
            };
        }
    }
}

