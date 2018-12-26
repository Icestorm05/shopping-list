const { convertObjectID } = require("../utils");
const ShoppingCartItem = require("../models/ShoppingCartItem");

exports.shoppingCartItems = () =>
    ShoppingCartItem.find({}).lean().exec()
        .then(items => items.map(convertObjectID));
    
exports.createShoppingCartItem = ({ shoppingCartItem }) =>
    ShoppingCartItem.create(shoppingCartItem)
        .then(item => convertObjectID(item.toObject()));

exports.removeShoppingCartItem = ({ id }) =>
    ShoppingCartItem.findOneAndRemove({ _id: id }, { runValidators: true })
        .lean().exec().then(convertObjectID);

exports.updateShoppingCartItem = ({ id, shoppingCartItem }) =>
    ShoppingCartItem.findOneAndUpdate({_id: id}, shoppingCartItem, { new: true, runValidators: true })
        .lean().exec().then(convertObjectID);
