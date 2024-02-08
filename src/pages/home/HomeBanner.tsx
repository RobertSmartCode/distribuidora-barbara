import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import Notification from '../../notification/Notification';
import WhatsAppLink from "../../whatapp/WhatsAppLink";


const HomeBanner: React.FC = () => {
  const banner= "https://firebasestorage.googleapis.com/v0/b/distribuidora-barbara.appspot.com/o/Logos%2FBannerDB.png?alt=media&token=a03cc02a-3c41-4074-bf4e-8a12b42adcee"
  return (
    <Grid container justifyContent="center" alignItems="center" marginTop="0px">
      <Grid item xs={12} lg={6}>
        <Link to="/shop">
          <img
            src={banner}
            alt="Banner"
            style={{
              width: "100%", // Ajusta el ancho según tus necesidades
              height: "auto", // Ajusta la altura automáticamente
              cursor: "pointer", // Cambia el cursor al pasar el ratón
            }}
          />
        </Link>
        <Notification />
        <WhatsAppLink/>
      </Grid>
    </Grid>
  );
};

export default HomeBanner;