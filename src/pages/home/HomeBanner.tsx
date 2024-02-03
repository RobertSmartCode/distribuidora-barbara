import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

const HomeBanner: React.FC = () => {
  const videoUrl =
    "https://firebasestorage.googleapis.com/v0/b/distribuidora-barbara.appspot.com/o/Imagen%2FHaz%20clik%20aqui%20para%20ver%20los%20productos.mp4?alt=media&token=3c0662d3-c120-4008-8cb2-c7d2e20372c5";

  return (
    <Grid container justifyContent="center" alignItems="center" marginTop="0px">
      <Grid item xs={12} lg={6}>
        <Link to="/shop">
          <video
            width="100%" 
            height="auto"
            autoPlay
            muted 
          >
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </Link>
      </Grid>
    </Grid>
  );
};

export default HomeBanner;

