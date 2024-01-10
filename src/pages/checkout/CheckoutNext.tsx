import { Box,CssBaseline,} from "@mui/material";
import BannerSecure from "./BannerSecure"
import Banner from "./Banner"
import CartCheckout from './CartCheckout '; 
import CouponValidation from './CuponValidation'; 
import UserInfo from './UserInfo'; 
import { MercadoPagoPayment } from "./MercadoPagoPayment";
import { TransferPayment } from "./TransferPayment";
import { CashPayment } from "./CashPayment";


const CheckoutNext: React.FC = () => {

  return (
    <Box
    sx={{
      backgroundColor: 'white',
      height: '100%',
      maxWidth: '100%',
      
      paddingBottom: '10px',
    }}
    >
              <CssBaseline />
              <BannerSecure/>
              <Banner/>
              <CartCheckout />
              <CouponValidation />
              <UserInfo/>
              <MercadoPagoPayment/>
              <TransferPayment/>
              <CashPayment />
            
    </Box>
  );
};

export default CheckoutNext;
