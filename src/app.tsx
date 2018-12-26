import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";

import "~/assets/css/pe-icon-set-food.css";

import Router from "./router";

const App = document.getElementById("App");

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(),
});

if (process.env.NODE_ENV === "production") {
    render(<ApolloProvider client={client}>
            <Router />
           </ApolloProvider>, App);
} else {
    const { hot } = require("react-hot-loader");
    const HotRouter = hot(module)(Router);
    render(<ApolloProvider client={client}>
            <HotRouter />
           </ApolloProvider>, App);
}
