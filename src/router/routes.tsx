import React from "react";
import Home from "../pages/home/Home";
import ItemDetail from "../components/pageComponents/itemDetail/ItemDetail";
import Shop from "../pages/shop/Shop";
import UserOrders from "../pages/UserAccount/UserAccount";
import SearchPage from "../pages/search/SearchPage";


interface Route {
  id: string;
  path: string;
  Element: React.ComponentType;
}

export const routes: Route[] = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "shop",
    path: "/shop",
    Element: Shop,
  },
  {
    id: "detalle",
    path: "/itemDetail/:id",
    Element: ItemDetail,
  },
  {
    id: "userOrders",
    path: "/user-orders",
    Element: UserOrders,
  },
  {
    id: "search",
    path: "/search",
    Element: SearchPage,
  }
];
