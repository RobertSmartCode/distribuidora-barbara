import Products from './Products';

import { Grid } from '@mui/material';

const MenuButton = () => {

 return (
    <Grid container spacing={2} justifyContent="center">
      
      
     
      <Grid item sx={{ margin: '0 5px' }}>
      <Products />
      </Grid>
    </Grid>
  );
}

export default MenuButton;



