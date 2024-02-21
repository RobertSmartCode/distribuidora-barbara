import React from "react";
import HomeBanner from "./HomeBanner";
import BestSellers from "./BestSellers";
import NewArrivals from "./NewArrivals";
import Footer from "../../components/common/layout/Navbar/Footer/Footer";

const Home: React.FC = () => {
  return (
    <>
      <HomeBanner/>
      <NewArrivals/>
      <BestSellers/>
      <Footer /> 
    </>
  );
};

export default Home;
