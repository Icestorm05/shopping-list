import React from "react";
import Loadable from "react-loadable";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Layout from "~/layouts/main";

const Home = Loadable({
    loader: () => import("~/routes/Home/Home"),
    loading: () => <div>Loading...</div>,
});

const Routes = () => (
    <Router>
        <Layout>
            <Route exact path="/" component={Home}></Route>
        </Layout>
    </Router>
);

export default Routes;
