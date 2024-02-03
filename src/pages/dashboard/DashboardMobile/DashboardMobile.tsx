import {Box, CssBaseline, IconButton} from "@mui/material";
import ProductAddForm from "../Products/ProductAddForm";
import ProductsList from "../Products/ProductMobile/ProductsList";
import MyOrders from "../MyOrders/MyOrders";
import PaymentMethodsList from "../PaymentMethods/PaymentMethodsList";
import ShippingMethodsList from "../ShippingMethodsForm/ShippingMethodsList";
import StoreDataList from "../StoreData/StoreDataList";
import PromoCode from "../PromoCode/PromoCode";
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "80px", 
  marginRight: "80px", 
  gap:"20px"

};

const Dashboard: React.FC = () => {

  return (
    <Box sx={containerStyles}>
      <CssBaseline />
      <Link to="/" style={{ textDecoration: 'none' }}>
        <IconButton>
          <HomeIcon style={{ fontSize: '3rem', marginTop:"30px" }} />
        </IconButton>
      </Link>
      <MyOrders />
      <ProductAddForm />
      <ProductsList />
      <PaymentMethodsList />
      <ShippingMethodsList />
      <StoreDataList />
      <PromoCode />
    </Box>
  );  
};

export default Dashboard;