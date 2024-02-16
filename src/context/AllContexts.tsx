// AllContexts.tsx
import React, { ReactNode } from 'react';
import AuthContextComponent from './AuthContext';
import CartContextComponent from './CartContext';
import SearchContextComponent from "./SearchContext";
import ImagesContextComponent from "./ImagesContext";
import StoreDataContextComponent from "./StoreDataContext";
import CashRegisterContextComponent from "./CashRegisterContext";
import SelectedItemsContextComponent from "./SelectedItems";
import ShippingContextComponent from "./ShippingMethodsContext";
import PaymentMethodsContextComponent from './PaymentMethodsContext'
import CategoriesContextComponent from './CategoriesContext';
import { CustomerContextComponent } from './CustomerContext';


interface AllContextsProps {
  children: ReactNode;
}

const AllContexts: React.FC<AllContextsProps> = ({ children }) => {
 
  return (
    <CategoriesContextComponent>
    <StoreDataContextComponent>
      <PaymentMethodsContextComponent>
        <ShippingContextComponent>
          <CustomerContextComponent>
          <CashRegisterContextComponent >
            <SelectedItemsContextComponent>
              <ImagesContextComponent>
                  <SearchContextComponent>
                        <CartContextComponent>
                          <AuthContextComponent>
                          {children}
                          </AuthContextComponent>
                        </CartContextComponent>
                  </SearchContextComponent>
                </ImagesContextComponent>
              </SelectedItemsContextComponent>
            </CashRegisterContextComponent>
            </CustomerContextComponent>
          </ShippingContextComponent>
          </PaymentMethodsContextComponent>
      </StoreDataContextComponent>
      </CategoriesContextComponent>
  );
};

export default AllContexts;
