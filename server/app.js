const express = require("express");
const expressGraphQL = require("express-graphql");
const { buildSchema } = require("graphql");
const { fileLoader, mergeTypes } = require("merge-graphql-schemas");
const mongoose = require("mongoose");
const path = require("path");

const shoppingItemResolver = require("./resolvers/ShoppingItem");
const shoppingCartItemResolver = require("./resolvers/ShoppingCartItem");

(async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ShoppingList", { useNewUrlParser: true });
        mongoose.set("useFindAndModify", false);
        console.log("Connected to ShoppingList DB successfully on port 27017.");
    } catch(e) {
        console.error(e);
    }
})();

const app = express();
app.use("/graphql", expressGraphQL({
    schema: buildSchema(mergeTypes(fileLoader(path.join(__dirname, "./schemas")), { all: true })),
    rootValue: {
        ...shoppingItemResolver,
        ...shoppingCartItemResolver,
    },
    graphiql: process.env.NODE_ENV === "production" ? false : true,
}));
app.set("port", process.env.PORT || 8081);
app.listen(app.get("port"), () => {
    console.log(`Listening on port ${app.get("port")}`);
});
