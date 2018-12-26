const { convertObjectID } = require("../utils");
const ShoppingItem = require("../models/ShoppingItem");

exports.shoppingItems = () =>
    ShoppingItem.find({}).lean().exec()
        .then(items => items.map(convertObjectID));

exports.createShoppingItem = ({ shoppingItem }) =>
    ShoppingItem.create(shoppingItem)
        .then(item => convertObjectID(item.toObject()));

exports.removeShoppingItem = ({ id }) =>
    ShoppingItem.findOneAndRemove({ _id: id }, { runValidators: true })
        .lean().exec().then(convertObjectID);

exports.updateShoppingItem = ({ id, shoppingItem }) =>
    ShoppingItem.findOneAndUpdate({_id: id}, shoppingItem, { new: true, runValidators: true })
        .lean().exec().then(convertObjectID);
