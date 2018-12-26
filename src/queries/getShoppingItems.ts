import gql from "graphql-tag";
import { ChildProps, GraphqlQueryControls } from "react-apollo";

import { IShoppingItem } from "~/types/shoppingItem";

const getShoppingItemsQuery = gql`
    {
        shoppingItems {
            icon
            _id
            name
        }
    }
`;

export default getShoppingItemsQuery;

export interface IGetShoppingItemsQueryResult { shoppingItems: IShoppingItem[]; }
export type TGetShoppingItemsQuery = ChildProps<GraphqlQueryControls & IGetShoppingItemsQueryResult>;
