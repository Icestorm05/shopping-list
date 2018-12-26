export interface IShoppingItem {
    _id?: string;
    name: string;
    icon: string;
}

export interface IShoppingCartItem extends IShoppingItem {
    description: string;
    quantity: number;
}
