import PropTypes from "prop-types";
import React, { ChangeEvent, Component } from "react";

import Icons from "~/assets/json/icons.json";
import { IShoppingItem } from "~/types/shoppingItem";

import { Button, Input, InputAdornment,
         ListItemIcon, MenuItem, Paper, Popper, Select, TextField } from "@material-ui/core";
import { FindReplace } from "@material-ui/icons";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { css } from "glamor";
import Autosuggest, { ChangeEvent as SuggestionChangeEvent, InputProps,
                      RenderSuggestionParams, RenderSuggestionsContainerParams,
                      SuggestionsFetchRequestedParams } from "react-autosuggest";

interface IShoppingSearchState {
    suggestions: IShoppingItem[];
}

interface IShoppingSearchProps {
    autocompleteItems?: IShoppingItem[] | null;
    item: IShoppingItem;
    onChange?: ((item: IShoppingItem) => any) | null;
    onRemove?: ((item: IShoppingItem) => any) | null;
}

class ShoppingSearch extends Component<IShoppingSearchProps, IShoppingSearchState> {
    public static propTypes() {
        const item = PropTypes.shape({
            _id: PropTypes.string,
            icon: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired;
        return {
            autocompleteItems: PropTypes.arrayOf(item),
            item,
            onChange: PropTypes.func,
            onRemove: PropTypes.func,
        };
    }

    private popperNode: HTMLElement | null = null;

    public constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
        };
    }

    public render() {
        return (
            <Autosuggest id="ShoppingSearch"
                         renderInputComponent={this.renderInputComponent}
                         suggestions={this.state.suggestions}
                         onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                         onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                         getSuggestionValue={this.getSuggestionValue}
                         renderSuggestion={this.renderSuggestion}
                         renderSuggestionsContainer={this.renderSuggestionsContainer}
                         inputProps={{
                             InputLabelProps: {
                                 shrink: true,
                             },
                             autoFocus: true,
                             fullWidth: true,
                             id: "item",
                             inputRef: (node) => {
                                 this.popperNode = node;
                             },
                             label: "Shopping Item",
                             margin: "normal",
                             onChange: this.handleChange,
                             placeholder: "Enter a Shopping Item here",
                             type: "search",
                             value: this.props.item.name,
                         }}
                         theme={{
                            suggestionsList: css({
                                listStyleType: "none",
                                margin: 0,
                                padding: 0,
                            }).toString(),
                         }} />
        );
    }

    private escapeRegex(word: string) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "");
    }

    private getSuggestions(value: string) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ?
            [] :
            (this.props.autocompleteItems || []).filter((item) => {
                return item.name.slice(0, inputLength).toLowerCase() === inputValue;
            });
    }

    private getSuggestionValue = (item: IShoppingItem) => item.name;

    private handleChange = (event, { newValue, method }: SuggestionChangeEvent) => {
        if (this.props.onChange) {
            const clickOrEnter = method === "click" || method === "enter";
            const shoppingItem = (this.props.autocompleteItems || []).find((autocompleteItem) => {
                return autocompleteItem.name === newValue;
            });
            this.props.onChange({
                ...this.props.item,
                _id: shoppingItem ? shoppingItem._id : "",
                icon: shoppingItem && clickOrEnter ? shoppingItem.icon : this.props.item.icon,
                name: newValue,
            });
        }
    }

    private handleFindReplaceClick = () => {
        if (this.props.onChange) {
            const name = this.props.item.name;
            const [icon, iconCount] = Object.entries(Icons.reduce((acc, Icon) => {
                acc[Icon] = name ?
                    name
                        .split(/ /g)
                        .filter((word) => new RegExp(this.escapeRegex(word), "i").test(Icon)).length :
                    0;
                return acc;
            }, {})).reduce((prev, curr) => prev[1] < curr[1] ? curr : prev);
            this.props.onChange({
                ...this.props.item,
                icon: iconCount > 0 ? icon : "",
            });
        }
    }

    private handleIconChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (this.props.onChange) {
            this.props.onChange({...this.props.item, icon: event.target.value});
        }
    }

    private handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    }

    private handleSuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    }

    private renderInputComponent = (inputProps: InputProps<IShoppingItem>) => {
        const { defaultValue, inputRef, ref, ...other } = inputProps;

        const clickable = css({ cursor: "pointer" }).toString();
        const justifyCenter = css({ justifyContent: "center" }).toString();

        return (
            <TextField InputProps={{
                endAdornment: (
                    <InputAdornment position="end"
                                    className={clickable}
                                    onClick={this.handleFindReplaceClick}>
                        <ListItemIcon>
                            <FindReplace />
                        </ListItemIcon>
                    </InputAdornment>
                ),
                inputRef: (node) => {
                    ref(node);
                    inputRef(node);
                },
                startAdornment: (
                    <InputAdornment position="start"
                                    className={clickable}>
                        <Select value={this.props.item.icon}
                                onChange={this.handleIconChange}
                                input={<Input name="icon" id="icon" disableUnderline={true} />}
                                displayEmpty
                                SelectDisplayProps={{
                                    style: {
                                        textAlign: "center",
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                        },
                                    },
                                }}>
                            <MenuItem className={justifyCenter}
                                      value="">No Icon</MenuItem>
                            {Icons.map((Icon) => (
                                <MenuItem className={justifyCenter}
                                          key={Icon}
                                          value={Icon}>
                                    <i className={Icon} />
                                </MenuItem>
                            ))}
                        </Select>
                    </InputAdornment>
                ),
            }}
            {...other} />
        );
    }

    private renderSuggestion = (item: IShoppingItem, { query, isHighlighted }: RenderSuggestionParams) => {
        const matches = match(item.name, query);
        const parts = parse(item.name, matches);

        return (
            <MenuItem selected={isHighlighted}
                      component="div">
                <div className={css({ width: "100%", display: "flex", alignItems: "center" }).toString()}>
                    <ListItemIcon>
                        <i className={item.icon}></i>
                    </ListItemIcon>
                    {parts.map(({ highlight, text }, index) => {
                        const displayWhitespace = css({ whiteSpace: "pre" }).toString();
                        return highlight ? (
                            <span className={displayWhitespace}
                                  key={String(index)}
                                  style={{ fontWeight: 500 }}>{text}</span>
                        ) : (
                            <strong className={displayWhitespace}
                                    key={String(index)}
                                    style={{ fontWeight: 300 }}>{text}</strong>
                        );
                    })}
                    <Button className={css({ marginLeft: "auto" }).toString()} onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.props.onRemove) {
                            Promise.resolve(this.props.onRemove(item)).then(() => {
                                this.setState({
                                    suggestions: this.state.suggestions.filter((suggestion) => {
                                        return suggestion.name !== item.name;
                                    }),
                                });
                            });
                        }
                    }}>Remove</Button>
                </div>
            </MenuItem>
        );
    }

    private renderSuggestionsContainer = ({ containerProps, children }: RenderSuggestionsContainerParams) => (
        <Popper anchorEl={this.popperNode}
                open={Boolean(children)}>
            <Paper square
                   {...containerProps}
                   style={{ width: this.popperNode ? this.popperNode.clientWidth : undefined}}>
                {children}
            </Paper>
        </Popper>
    )
}

export default ShoppingSearch;
