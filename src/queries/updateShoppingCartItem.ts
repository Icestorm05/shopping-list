import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingCartItem } from "~/types/shoppingItem";

const updateShoppingCartItemQuery = gql`
    mutation UpdateShoppingCartItem($id: ID, $shoppingCartItem: ShoppingCartInput) {
        updateShoppingCartItem(id: $id, shoppingCartItem: $shoppingCartItem) {
            _id
            icon
            name
            description
            quantity
        }
    }
`;

export default updateShoppingCartItemQuery;

export interface IUpdateShoppingCartItemQuery { updateShoppingCartItem: IShoppingCartItem; }
export interface IUpdateShoppingCartItemQueryVariables { shoppingCartItem: IShoppingCartItem; id: string; }
export type TUpdateShoppingCartItemQuery = MutationFn<IUpdateShoppingCartItemQuery,
                                                      IUpdateShoppingCartItemQueryVariables>;
