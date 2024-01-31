import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AllContexts from "./context/AllContexts";
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

function App() {

  return (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AllContexts>
        <AppRouter />
      </AllContexts>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
