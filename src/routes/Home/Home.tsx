import { css } from "glamor";
import React, { Component } from "react";
import { compose, graphql } from "react-apollo";

import createShoppingCartItemQuery, { TCreateShoppingCartItemQuery } from "~/queries/createShoppingCartItem";
import createShoppingItemQuery, { TCreateShoppingItemQuery } from "~/queries/createShoppingItem";
import getShoppingCartItemsQuery, {
    IGetShoppingCartItemsQueryResult, TGetShoppingCartItemsQuery,
} from "~/queries/getShoppingCartItems";
import getShoppingItemsQuery, {
    IGetShoppingItemsQueryResult, TGetShoppingItemsQuery,
} from "~/queries/getShoppingItems";
import removeShoppingCartItemQuery, { TRemoveShoppingCartItemQuery } from "~/queries/removeShoppingCartItem";
import removeShoppingItemQuery, { TRemoveShoppingItemQuery } from "~/queries/removeShoppingItem";
import updateShoppingCartItemQuery, { TUpdateShoppingCartItemQuery } from "~/queries/updateShoppingCartItem";
import updateShoppingItemQuery, { TUpdateShoppingItemQuery } from "~/queries/updateShoppingItem";
import { IShoppingCartItem, IShoppingItem } from "~/types/shoppingItem";

import ShoppingForm from "~/components/ShoppingForm/ShoppingForm";
import ShoppingList from "~/components/ShoppingList/ShoppingList";

interface IHomeProps {
    createShoppingCartItemQuery: TCreateShoppingCartItemQuery;
    createShoppingItemQuery: TCreateShoppingItemQuery;
    shoppingItemsQuery: TGetShoppingItemsQuery;
    shoppingCartItemsQuery: TGetShoppingCartItemsQuery;
    removeShoppingCartItemQuery: TRemoveShoppingCartItemQuery;
    removeShoppingItemQuery: TRemoveShoppingItemQuery;
    updateShoppingCartItemQuery: TUpdateShoppingCartItemQuery;
    updateShoppingItemQuery: TUpdateShoppingItemQuery;
}

@compose(
    graphql(createShoppingCartItemQuery, { name: "createShoppingCartItemQuery" }),
    graphql(createShoppingItemQuery, { name: "createShoppingItemQuery" }),
    graphql(getShoppingCartItemsQuery, { name: "shoppingCartItemsQuery" }),
    graphql(getShoppingItemsQuery, { name: "shoppingItemsQuery" }),
    graphql(removeShoppingCartItemQuery, { name: "removeShoppingCartItemQuery" }),
    graphql(removeShoppingItemQuery, { name: "removeShoppingItemQuery" }),
    graphql(updateShoppingCartItemQuery, { name: "updateShoppingCartItemQuery" }),
    graphql(updateShoppingItemQuery, { name: "updateShoppingItemQuery" }),
)
class Home extends Component<IHomeProps> {
    public constructor(props) {
        super(props);
    }

    public render() {
        return (
            <>
                <ShoppingForm memory={this.shoppingItems}
                              onRemove={this.handleRemove}
                              onSubmit={this.handleSubmit}
                              className={css({ "@media print": { display: "none" } }).toString()} />
                <ShoppingList id="ShoppingList"
                              items={this.shoppingCartItems}
                              onRemove={this.handleCartRemove} />
            </>
        );
    }

    private addToCart(shoppingCartItem: IShoppingCartItem) {
        const cartItem = this.shoppingCartItems.find((item) =>
            item.name === shoppingCartItem.name &&
            item.description === shoppingCartItem.description);
        if (!cartItem) {
            this.props.createShoppingCartItemQuery({
                update: (cache, newShoppingCartItem) => {
                    const queryData = cache.readQuery<IGetShoppingCartItemsQueryResult>(
                        { query: getShoppingCartItemsQuery },
                    );
                    if (queryData && newShoppingCartItem.data) {
                        const newItem = newShoppingCartItem.data.createShoppingCartItem;
                        cache.writeQuery({
                            data: {
                                shoppingCartItems: queryData.shoppingCartItems
                                    .concat([newItem]),
                            },
                            query: getShoppingCartItemsQuery,
                        });
                    }
                },
                variables: {
                    shoppingCartItem: {
                        description: shoppingCartItem.description,
                        icon: shoppingCartItem.icon,
                        name: shoppingCartItem.name,
                        quantity: shoppingCartItem.quantity,
                    },
                },
            });
        } else if (cartItem._id) {
            this.props.updateShoppingCartItemQuery({
                update: (cache, updated) => {
                    const queryData = cache.readQuery<IGetShoppingCartItemsQueryResult>(
                        { query: getShoppingCartItemsQuery },
                    );
                    if (queryData && updated.data) {
                        const updatedData = updated.data.updateShoppingCartItem;
                        cache.writeQuery({
                            data: {
                                shoppingCartItems: queryData.shoppingCartItems
                                    .map((item) => {
                                        if (item._id === updatedData._id) {
                                            return updatedData;
                                        } else {
                                            return item;
                                        }
                                    }),
                            },
                            query: getShoppingCartItemsQuery,
                        });
                    }
                },
                variables: {
                    id: cartItem._id,
                    shoppingCartItem: {
                        description: shoppingCartItem.description,
                        icon: shoppingCartItem.icon,
                        name: cartItem.name,
                        quantity: cartItem.quantity + 1,
                    },
                },
            });
        }
    }

    private get shoppingItems() {
        return this.props.shoppingItemsQuery.shoppingItems || [];
    }

    private get shoppingCartItems() {
        return this.props.shoppingCartItemsQuery.shoppingCartItems || [];
    }

    private handleCartRemove = (item: IShoppingCartItem) => {
        if (item._id) {
            if (item.quantity > 1) {
                this.props.updateShoppingCartItemQuery({
                    update: (cache, updated) => {
                        const queryData = cache.readQuery<IGetShoppingCartItemsQueryResult>(
                            { query: getShoppingCartItemsQuery },
                        );
                        if (queryData && updated.data) {
                            const updatedItem = updated.data.updateShoppingCartItem;
                            cache.writeQuery({
                                data: {
                                    shoppingCartItems: queryData.shoppingCartItems
                                        .map((shoppingItem) => {
                                            if (shoppingItem._id === updatedItem._id) {
                                                return updatedItem;
                                            } else {
                                                return shoppingItem;
                                            }
                                        }),
                                },
                                query: getShoppingCartItemsQuery,
                            });
                        }
                    },
                    variables: {
                        id: item._id,
                        shoppingCartItem: {
                            description: item.description,
                            icon: item.icon,
                            name: item.name,
                            quantity: item.quantity - 1,
                        },
                    },
                });
            } else {
                this.props.removeShoppingCartItemQuery({
                    update: (cache, removed) => {
                        const queryData = cache.readQuery<IGetShoppingCartItemsQueryResult>(
                            { query: getShoppingCartItemsQuery },
                        );
                        if (queryData && removed.data) {
                            const removedItem = removed.data.removeShoppingCartItem;
                            cache.writeQuery({
                                data: {
                                    shoppingCartItems: queryData.shoppingCartItems
                                        .filter((shoppingCartItem) => {
                                            return shoppingCartItem._id !== removedItem._id;
                                        }),
                                },
                                query: getShoppingCartItemsQuery,
                            });
                        }
                    },
                    variables: {
                        id: item._id,
                    },
                });
            }
        }
        // this.setState({
        //     shoppingItems: this.shoppingCartItems.filter((shoppingItem) => {
        //         return !(shoppingItem.name === item.name &&
        //             shoppingItem.description === item.description &&
        //             shoppingItem.quantity === 1);
        //     }).map((shoppingItem) => {
        //         if (shoppingItem.name === item.name &&
        //             shoppingItem.description === item.description &&
        //             shoppingItem.quantity > 1) {
        //             shoppingItem.quantity--;
        //         }
        //         return shoppingItem;
        //     }),
        // });
    }

    private handleRemove = (item: IShoppingItem) => {
        if (item._id) {
            return this.props.removeShoppingItemQuery({
                update: (cache, removedShoppingItem) => {
                    const queryData = cache.readQuery<IGetShoppingItemsQueryResult>(
                        { query: getShoppingItemsQuery },
                    );
                    if (queryData && removedShoppingItem.data) {
                        const removedItem = removedShoppingItem.data.removeShoppingItem;
                        cache.writeQuery({
                            data: {
                                shoppingItems: queryData.shoppingItems
                                    .filter((shoppingItem) => {
                                        return shoppingItem._id !== removedItem._id;
                                    }),
                            },
                            query: getShoppingItemsQuery,
                        });
                    }
                },
                variables: {
                    id: item._id,
                },
            });
        }
    }

    private handleSubmit = async (cartItem: IShoppingCartItem) => {
        this.addToCart(cartItem);
        const shoppingItem = this.shoppingItems.find((curr) => curr._id === cartItem._id);
        if (!shoppingItem) {
            const query = await this.props.createShoppingItemQuery({
                update: (cache, newShoppingItem) => {
                    const queryData = cache.readQuery<IGetShoppingItemsQueryResult>(
                        { query: getShoppingItemsQuery },
                    );
                    if (queryData && newShoppingItem.data) {
                        cache.writeQuery({
                            data: {
                                shoppingItems: queryData.shoppingItems
                                    .concat([newShoppingItem.data.createShoppingItem]),
                            },
                            query: getShoppingItemsQuery,
                        });
                    }
                },
                variables: {
                    shoppingItem: {
                        icon: cartItem.icon, name: cartItem.name,
                    },
                },
            });
            return query && query.data ? query.data.createShoppingItem : undefined;
        } else if (shoppingItem._id && shoppingItem.icon !== cartItem.icon) {
            const query = await this.props.updateShoppingItemQuery({
                update: (cache, updated) => {
                    const queryData = cache.readQuery<IGetShoppingItemsQueryResult>(
                        { query: getShoppingItemsQuery },
                    );
                    if (queryData && updated.data) {
                        const updatedData = updated.data.updateShoppingItem;
                        cache.writeQuery({
                            data: {
                                shoppingItems: queryData.shoppingItems
                                    .map((item) => {
                                        if (item._id === updatedData._id) {
                                            return updatedData;
                                        } else {
                                            return item;
                                        }
                                    }),
                            },
                            query: getShoppingItemsQuery,
                        });
                    }
                },
                variables: {
                    id: shoppingItem._id,
                    shoppingItem: {
                        icon: cartItem.icon, name: cartItem.name,
                    },
                },
            });
            return query && query.data ? query.data.updateShoppingItem : undefined;
        }
    }
}

export default Home;
