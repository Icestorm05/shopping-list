import { css } from "glamor";
import PropTypes from "prop-types";
import React, { SFC } from "react";

import theme from "~/theme";

import { IShoppingCartItem } from "~/types/shoppingItem";

import { Divider, IconButton, List, ListItem, ListItemIcon,
         ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";

interface IShoppingListProps {
    id: string;
    items: IShoppingCartItem[];
    onRemove?: ((item: IShoppingCartItem) => any) | null;
}

const root = css({
    backgroundColor: theme.palette.background.paper,
}).toString();

const ShoppingList: SFC<IShoppingListProps> = ({ id, items, onRemove }) => (
    <List id={id}
          className={root}
          component="nav">
        {items.length ? items.map((item, i) => (
            <React.Fragment key={i}>
                <ListItem>
                    <ListItemIcon>
                        <i className={item.icon} style={{ textAlign: "center", width: 16 }}></i>
                    </ListItemIcon>
                    <ListItemText primary={`${item.name} ${item.quantity > 1 ? `x${item.quantity}` : ""}`}
                                secondary={item.description ? `Note: ${item.description}` : ""} />
                    <ListItemSecondaryAction className={css({ "@media print": { display: "none" } }).toString()}>
                        <IconButton aria-label="remove"
                                    onClick={onRemove ? onRemove.bind(null, item) : ""}>
                            <RemoveCircle />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {i !== (items.length - 1) ? <Divider /> : <></>}
            </React.Fragment>
        )) : (
            <Typography component="p">No items in Shopping List.</Typography>
        )}
    </List>
);

ShoppingList.propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    onRemove: PropTypes.func,
};

export default ShoppingList;
