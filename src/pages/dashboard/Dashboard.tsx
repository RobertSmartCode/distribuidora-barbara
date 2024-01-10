import { useMediaQuery } from "@mui/material";

import DashboardMobile from "./DashboardMobile/DashboardMobile";
import DashboardDesktop from "./DashboardDesktop/DashboardDesktop";




const Dashboard: React.FC = () => {
  // Utiliza 'useMediaQuery' para determinar si es móvil o no
  const isMobile = useMediaQuery('(max-width:600px)');

  return isMobile ? <DashboardMobile /> : <DashboardDesktop />;
};

export default Dashboard;
