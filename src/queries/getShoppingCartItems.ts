import gql from "graphql-tag";
import { ChildProps, GraphqlQueryControls } from "react-apollo";

import { IShoppingCartItem } from "~/types/shoppingItem";

const getShoppingCartItemsQuery = gql`
    {
        shoppingCartItems {
            description
            icon
            _id
            name
            quantity
        }
    }
`;

export default getShoppingCartItemsQuery;

export interface IGetShoppingCartItemsQueryResult { shoppingCartItems: IShoppingCartItem[]; }
export type TGetShoppingCartItemsQuery = ChildProps<GraphqlQueryControls & IGetShoppingCartItemsQueryResult>;
