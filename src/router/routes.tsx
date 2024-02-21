import React from "react";
import Home from "../pages/home/Home";
import ItemDetail from "../components/pageComponents/itemDetail/ItemDetail";
import Shop from "../pages/shop/Shop";
import UserOrders from "../pages/UserAccount/UserAccount";
import SearchPage from "../pages/search/SearchPage";
import OnlineShoppingGuide from "../pages/frequentlyQuestions/OnlineShoppingGuide";
import LocalShopping from "../pages/frequentlyQuestions/LocalShopping";
import ShipmentTracking from "../pages/frequentlyQuestions/ShipmentTracking";
import LegalTerms from "../pages/frequentlyQuestions/LegalTerms";

import Category from "../pages/category/Category";

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
    path: "/itemDetail/:title/:id",
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
  },
  {
    id: "OnlineShoppingGuide",
    path: "/como-comprar-por-la-web",
    Element: OnlineShoppingGuide,
  }, 
  {
    id: "LocalShopping",
    path: "/compras-de-forma-presencia",
    Element: LocalShopping,
  },
  {
    id: "ShipmentTracking",
    path: "/envio-y-seguimiento",
    Element: ShipmentTracking,
  }, 
  {
    id: "LegalTerms",
    path: "/terminos-y-condiciones",
    Element: LegalTerms,
  }, 


  {
    id: "category",
    path: "/:category",
    Element: Category,
  },
  {
    id: "subCategory",
    path: "/:category/:subcategory",
    Element: Category,
  },
];
