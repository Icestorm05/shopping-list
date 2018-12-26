import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingCartItem } from "~/types/shoppingItem";

const removeShoppingCartItemQuery = gql`
    mutation RemoveShoppingCartItem($id: ID) {
        removeShoppingCartItem(id: $id) {
            _id
            icon
            name
            description
            quantity
        }
    }
`;

export default removeShoppingCartItemQuery;

export interface IRemoveShoppingCartItemQuery { removeShoppingCartItem: IShoppingCartItem; }
export interface IRemoveShoppingCartItemQueryVariables { id: string; }
export type TRemoveShoppingCartItemQuery = MutationFn<IRemoveShoppingCartItemQuery,
                                                      IRemoveShoppingCartItemQueryVariables>;
