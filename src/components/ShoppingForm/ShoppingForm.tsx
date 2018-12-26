import { css } from "glamor";
import PropTypes from "prop-types";
import React, { ChangeEvent, Component, FormEvent } from "react";

import theme from "~/theme";
import { IShoppingCartItem, IShoppingItem } from "~/types/shoppingItem";

import { Button, TextField } from "@material-ui/core";
import ShoppingSearch from "./ShoppingSearch/ShoppingSearch";

interface IShoppingFormProps {
    className?: string;
    memory?: IShoppingItem[] | null;
    onRemove?: ((item: IShoppingItem) => any) | null;
    onSubmit?: ((item: IShoppingCartItem) => Promise<IShoppingItem | undefined>) | null;
}

interface IShoppingFormState {
    item: IShoppingCartItem;
}

class ShoppingForm extends Component<IShoppingFormProps, IShoppingFormState> {
    public static propTypes() {
        return {
            className: PropTypes.string,
            memory: PropTypes.arrayOf(PropTypes.shape({
                _id: PropTypes.string.isRequired,
                icon: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired),
            onRemove: PropTypes.func,
            onSubmit: PropTypes.func,
        };
    }

    public constructor(props) {
        super(props);
        this.state = {
            item: {
                _id: "",
                description: "",
                icon: "",
                name: "",
                quantity: 0,
            },
        };
    }

    public render() {
        return (
            <form noValidate
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                  className={this.props.className}>
                <ShoppingSearch autocompleteItems={this.props.memory}
                                item={this.state.item}
                                onChange={this.handleSearchChange}
                                onRemove={(item) => this.props.onRemove ? this.props.onRemove(item) : ""} />
                <TextField id="description"
                           label="Description"
                           placeholder="Enter Item Description Here"
                           multiline
                           margin="dense"
                           fullWidth
                           value={this.state.item.description}
                           onChange={this.handleDescriptionChange} />
                <div id="buttons" className={css({ marginTop: 10 }).toString()}>
                    <Button variant="contained"
                            color="primary"
                            disabled={!this.state.item.name}
                            type="submit">Add</Button>
                    <Button variant="contained"
                            color="primary"
                            disabled={!(this.state.item.name || this.state.item.icon || this.state.item.description)}
                            type="button"
                            onClick={this.handleClear}
                            className={css({ marginLeft: theme.spacing.unit }).toString()}>Clear</Button>
                </div>
            </form>
        );
    }

    private handleClear = () => {
        this.setState({
            item: {
                _id: "",
                description: "",
                icon: "",
                name: "",
                quantity: 0,
            },
        });
    }

    private handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            item: {
                ...this.state.item,
                description: event.target.value,
            },
        });
    }

    private handleSearchChange = (item: IShoppingItem) => {
        this.setState({
            item: {
                description: this.state.item.description,
                ...item,
                quantity: 1,
            },
        });
    }

    private handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.props.onSubmit) {
            const item = await this.props.onSubmit({...this.state.item});
            if (item) {
                this.setState({
                    item: {
                        description: this.state.item.description,
                        ...item,
                        quantity: this.state.item.quantity,
                    },
                });
            }
        }
    }
}

export default ShoppingForm;
