import { Box,} from "@mui/material";
import BannerSecure from "./BannerSecure"
import Banner from "./Banner"
import CartCheckout from './CartCheckout '; 
import CheckoutForm from './CheckoutForm'; 


export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

const Checkout: React.FC = () => {

 return (
    <Box
      sx={{
        backgroundColor: 'white',
        height: '100%',
        maxWidth: '100%',
      }}
    >
    
              <BannerSecure/>
              <Banner/>
              <CartCheckout/>
             
              <CheckoutForm/>
      
    
    </Box>
  );
};

export default Checkout;