import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingItem } from "~/types/shoppingItem";

const updateShoppingItemQuery = gql`
    mutation UpdateShoppingItem($id: ID, $shoppingItem: ShoppingInput) {
        updateShoppingItem(id: $id, shoppingItem: $shoppingItem) {
            _id
            icon
            name
        }
    }
`;

export default updateShoppingItemQuery;

export interface IUpdateShoppingItemQuery { updateShoppingItem: IShoppingItem; }
export interface IUpdateShoppingItemQueryVariables { shoppingItem: IShoppingItem; id: string; }
export type TUpdateShoppingItemQuery = MutationFn<IUpdateShoppingItemQuery, IUpdateShoppingItemQueryVariables>;
