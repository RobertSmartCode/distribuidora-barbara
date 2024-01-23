import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponent from "./context/CartContext";
import AuthContextComponent from "./context/AuthContext";
import FilterContextComponent from "./context/FilterContext";
import SortContextComponent from "./context/SortContext";
import SearchContextComponent from "./context/SearchContext";
import ColorsContextComponent from "./context/ColorsContext";
import ImagesContextComponent from "./context/ImagesContext";
import ProductVariantsComponent from "./context/ProductVariantsContext";
import { StoreDataProvider } from "./context/StoreDataContext";
import CashRegisterContextComponent from "./context/CashRegisterContext";




import { createTheme, ThemeProvider } from '@mui/material/styles';

import SelectedItemsContextComponent from "./context/SelectedItems";

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
    <StoreDataProvider>
    <CashRegisterContextComponent >
    <SelectedItemsContextComponent>
    <ProductVariantsComponent>
    <ImagesContextComponent>
      <ColorsContextComponent>
        <SearchContextComponent>
          <SortContextComponent>
            <FilterContextComponent>
              <CartContextComponent>
                <AuthContextComponent>
                  <AppRouter />
                </AuthContextComponent>
              </CartContextComponent>
            </FilterContextComponent>
          </SortContextComponent>
        </SearchContextComponent>
      </ColorsContextComponent>
      </ImagesContextComponent>
      </ProductVariantsComponent>
      </SelectedItemsContextComponent>
      </CashRegisterContextComponent>
      </StoreDataProvider>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
