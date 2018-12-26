import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingCartItem } from "~/types/shoppingItem";

const createShoppingCartItemQuery = gql`
    mutation CreateShoppingCartItem($shoppingCartItem: ShoppingCartInput) {
        createShoppingCartItem(shoppingCartItem: $shoppingCartItem) {
            _id
            icon
            name
            description
            quantity
        }
    }
`;

export default createShoppingCartItemQuery;

export interface ICreateShoppingCartItemQuery { createShoppingCartItem: IShoppingCartItem; }
export interface ICreateShoppingCartItemQueryVariables { shoppingCartItem: IShoppingCartItem; }
export type TCreateShoppingCartItemQuery = MutationFn<ICreateShoppingCartItemQuery,
                                                      ICreateShoppingCartItemQueryVariables>;
