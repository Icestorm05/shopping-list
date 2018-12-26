const mongoose = require("mongoose");

const ShoppingCartItemSchema = new mongoose.Schema({
    icon: String,
    name: String,
    description: String,
    quantity: Number,
});

module.exports = mongoose.model("ShoppingCartItem", ShoppingCartItemSchema);
