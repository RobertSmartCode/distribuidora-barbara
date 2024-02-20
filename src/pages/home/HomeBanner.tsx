import React from "react";
import { Link } from "react-router-dom";
import { Grid, Hidden } from "@mui/material";

const HomeBanner: React.FC = () => {
  const bannerMobile = "https://firebasestorage.googleapis.com/v0/b/distribuidora-barbara.appspot.com/o/Logos%2FBannerDB.png?alt=media&token=a03cc02a-3c41-4074-bf4e-8a12b42adcee";
  const bannerDesktop = "https://firebasestorage.googleapis.com/v0/b/distribuidora-barbara.appspot.com/o/AAA%2FBarbara%20(1).png?alt=media&token=e9888bfc-1b54-4cbb-b57c-b49c1c6259d7";

  return (
    <Grid container justifyContent="center" alignItems="center" marginTop="0px">
      <Grid item xs={12} lg={12}>
        <Hidden mdUp>
          {/* Se muestra en dispositivos móviles */}
          <Link to="/shop">
            <img
              src={bannerMobile}
              alt="Banner"
              style={{
                width: "100%", // Ajusta el ancho según tus necesidades
                height: "auto", // Ajusta la altura automáticamente
                cursor: "pointer", // Cambia el cursor al pasar el ratón
              }}
            />
          </Link>
        </Hidden>
        <Hidden mdDown>
          {/* Se muestra en dispositivos desktop */}
          <Link to="/shop">
            <img
              src={bannerDesktop}
              alt="Banner"
              style={{
                width: "100%", // Ajusta el ancho según tus necesidades
                height: "auto", // Ajusta la altura automáticamente
                cursor: "pointer", // Cambia el cursor al pasar el ratón
              }}
            />
          </Link>
        </Hidden>
      </Grid>
    </Grid>
  );
};

export default HomeBanner;
