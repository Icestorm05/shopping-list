import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { IShoppingItem } from "~/types/shoppingItem";

const removeShoppingItemQuery = gql`
    mutation RemoveShoppingItem($id: ID) {
        removeShoppingItem(id: $id) {
            _id
            icon
            name
        }
    }
`;

export default removeShoppingItemQuery;

export interface IRemoveShoppingItemQuery { removeShoppingItem: IShoppingItem; }
export interface IRemoveShoppingItemQueryVariables { id: string; }
export type TRemoveShoppingItemQuery = MutationFn<IRemoveShoppingItemQuery, IRemoveShoppingItemQueryVariables>;
