export interface IBook {
    title: string;
    author: string;
    description: string;
    price: number;
    quantity: number;
    categories: ICategories[];
}

export interface ICategories {
    name: string;
}
