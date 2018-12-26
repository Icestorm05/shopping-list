import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingItem } from "~/types/shoppingItem";

const createShoppingItemQuery = gql`
    mutation CreateShoppingItem($shoppingItem: ShoppingInput) {
        createShoppingItem(shoppingItem: $shoppingItem) {
            _id
            icon
            name
        }
    }
`;

export default createShoppingItemQuery;

export interface ICreateShoppingItemQuery { createShoppingItem: IShoppingItem; }
export interface ICreateShoppingItemQueryVariables { shoppingItem: IShoppingItem; }
export type TCreateShoppingItemQuery = MutationFn<ICreateShoppingItemQuery, ICreateShoppingItemQueryVariables>;
