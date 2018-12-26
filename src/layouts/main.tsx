import { AppBar, CssBaseline, Toolbar, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React, { SFC } from "react";
import theme from "~/theme";

const MainLayout: SFC = ({ children }) => (
    <>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
            <AppBar id="ShoppingListAppBar" position="static" color="primary">
                <Toolbar id="ShoppingListToolbar" >
                    <Typography id="ShoppingListToolbarTitle"
                                variant="title"
                                color="inherit">Shopping List</Typography>
                </Toolbar>
            </AppBar>
            <>{children}</>
        </MuiThemeProvider>
    </>
);

export default MainLayout;
