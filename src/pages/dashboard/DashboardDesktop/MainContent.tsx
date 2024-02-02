import { Typography } from '@mui/material';
import { useSelectedItemsContext } from '../../../context/SelectedItems';
import ProductsListDesktop from '../Products/ProductDesktop/ProductsListDesktop';
import ShippingMethodsDesktop from '../ShippingMethodsForm/ShippingMethodsDesktop';
import PaymentMethodsDesktop from '../PaymentMethods/PaymentMethodsDesktop';
import StoreDataDesktop from '../StoreData/StoreDataDesktop';
import PromoCodeDesktop from '../PromoCode/PromoCodeDesktop';
import ProductsFormDesktop from '../Products/ProductDesktop/ProductsFormDesktop';
import CompletedOrderList from '../MyOrders/CompletedOrderList';
import {ProductsFormDesktopProps}from "../../../type/type";


const MainContent = () => {
  const { selectedItems } = useSelectedItemsContext();

  // Obtén la primera selección (puedes ajustar según tus necesidades)
  const selectedItem = selectedItems[0]?.name || '';


  const productsFormDesktopProps: ProductsFormDesktopProps = {
    productSelected: null,
    setProductSelected: () => {},
    handleClose: () => {},
    setIsChange: () => {},
    products: [],
  };

  return (
    <>
       <Typography variant="h4" mb={3} style={{ textAlign: 'center'}}>
          {selectedItem}
       </Typography>


        {/* Renderizar el componente correspondiente según la selección */}
        {selectedItem === 'Ordenes' && <CompletedOrderList/>}
        {selectedItem === 'Agregar Producto' && <ProductsFormDesktop {...productsFormDesktopProps} />}
        {selectedItem === 'Mis Productos' && <ProductsListDesktop/>}
        {selectedItem === 'Métodos de Pago' && <PaymentMethodsDesktop />}
        {selectedItem === 'Métodos de Envío' && <ShippingMethodsDesktop/>}
        {selectedItem === 'Datos de la Tienda' && <StoreDataDesktop />}
        {selectedItem === 'Cupones y Ofertas' && <PromoCodeDesktop />}
    </>
  );
};

export default MainContent;
