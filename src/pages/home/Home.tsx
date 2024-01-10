import React from "react";
import HomeBanner from "./HomeBanner";
import BestSellers from "./BestSellers";
import NewArrivals from "./NewArrivals";

const Home: React.FC = () => {
  return (
    <div>
      <HomeBanner/>
      <NewArrivals/>
      <BestSellers/>
      
    </div>
  );
};

export default Home;
