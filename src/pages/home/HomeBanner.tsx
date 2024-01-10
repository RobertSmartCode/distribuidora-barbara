import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";



const HomeBanner: React.FC = () => {
  const banner= "https://firebasestorage.googleapis.com/v0/b/pinguinos-kids.appspot.com/o/LogoMobile%2FHomeBanner%20(1).png?alt=media&token=dc9b9675-ee1e-4b0e-ad15-e2436352d979"
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
      </Grid>
    </Grid>
  );
};

export default HomeBanner;
