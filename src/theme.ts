import { blue, indigo, red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        error: red,
        primary: blue,
        secondary: indigo,
    },
});

export default theme;
