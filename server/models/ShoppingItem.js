const mongoose = require("mongoose");

const ShoppingItemSchema = new mongoose.Schema({
    icon: String,
    name: String,
});

module.exports = mongoose.model("ShoppingItem", ShoppingItemSchema);
