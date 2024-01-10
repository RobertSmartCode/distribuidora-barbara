import { Box, CssBaseline, Grid } from '@mui/material';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const DashboardDesktop = () => {
  return (
    <Box display="flex" height="100vh"  style={{ backgroundColor: '#fff', height: '100%' }}  >
     <CssBaseline />
      <Grid container>
        {/* Sidebar en el lado izquierdo */}
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        {/* MainContent en el lado derecho */}
        <Grid item xs={9}>
          <MainContent />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardDesktop;
