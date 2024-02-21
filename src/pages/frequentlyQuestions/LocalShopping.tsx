import { Grid, Typography } from '@mui/material';
import Footer from '../../components/common/layout/Navbar/Footer/Footer';

const LocalShopping = () => {
  return (
    <>
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Typography variant="h4" align="center" gutterBottom>
          COMPRAS DE FORMA PRESENCIAL
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>EN EL LOCAL SÓLO SE REALIZA VENTA MAYORISTA</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Cuánto es el mínimo de compra en el local?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          No hay mínimo de compra abonando en efectivo.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Dónde está ubicado el local?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          La dirección es MORÓN 3374, local B entre las calles Concordia y Campana (Floresta, CABA).
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Cuáles son las formas de pago en el local?</strong>
        </Typography>
        <Typography component="ol" gutterBottom>
          <li>
            <strong>EFECTIVO (Sin mínimo de compra)</strong>
            <Typography variant="body2">
              - A partir de la décima prenda, te aplican un descuento del 10%. Si el total de tu compra en efectivo es mayor o igual a los siguientes montos, tenés un descuento extra:
              <ul>
                <li>≥ $50.000 es 8%</li>
                <li>≥ $100.000 es 10%</li>
                <li>≥ $150.000 es 15%</li>
                <li>≥ $200.000 es 17%</li>
              </ul>
            </Typography>
            <Typography variant="body2">
              Si sos comerciante/revendedor podés llevar a partir de 1 prenda por mayor abonando en efectivo con el valor del primer descuento adicional. (Se solicita constancia de CUIT comercial de indumentaria propio junto con el DNI). Si comprás en cantidad, se te aplican más descuentos.
            </Typography>
          </li>
          <li>
            <strong>TRANSFERENCIA BANCARIA (Mínimo 5 prendas)</strong>
            <Typography variant="body2">
              - Las prendas se entregan al siguiente día hábil, una vez verificado el pago.
            </Typography>
          </li>
          <li>
            <strong>DÉBITO (Mínimo 10 prendas)</strong>
          </li>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Horarios</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Lunes a Viernes: 8:00 a 16:30 hs 
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sábados: 8:00 a 13:00 hs 
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Las prendas tienen cambio?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sólo por talle.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Se puede probar en el local?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          No.
        </Typography>
      </Grid>
     
    </Grid>
    <Footer/>
    </>
  );
}

export default LocalShopping;
