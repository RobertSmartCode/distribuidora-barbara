import { Route, Routes } from "react-router-dom";
import Navbar from "../components/common/layout/Navbar/Navbar/Navbar";
import { routes } from "./routes";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import Checkout from "../pages/checkout/Checkout";
import CheckoutNext from "../pages/checkout/CheckoutNext";
import Dashboard from "../pages/dashboard/Dashboard";
import UserOrders from "../pages/UserAccount/UserAccount";
import ProtectedAdmin from "./ProtectedAdmin";
import ProtectedUsers from "./ProtectedUsers";
import PaymentSuccess  from "../pages/checkout/PaymentSuccess";
import PendingVerification from "../pages/checkout/PendingVerification";
import ProtectedCashier from "./ProtectedCashier";
import CashRegister from "../pages/cashregister/CashRegister";
import ProtectedCollector from "./ProtectedCollector";
import CashCollector from "../pages/cashcollector/CashCollector";


const AppRouter = () => {
  return (
    
    <Routes>

     {/* Para todos los usuarios */}
      <Route element={<Navbar />}>
        {routes.map(({ id, path, Element }) => (
          <Route key={id} path={path} element={<Element />} />
        ))}
      </Route>

      {/* PARA LOS USUARIOS LOGEADOS */}
      <Route element={<ProtectedUsers />}>
        <Route element={<Navbar />}>
        <Route path="/user-orders" element={<UserOrders />} />
        </Route>
      </Route>

      {/* PARA LOS USUARIOS ADMIN */}
      <Route element={<ProtectedAdmin />}>
       
          <Route path="/dashboard" element={<Dashboard />} />
       
      </Route>


       {/* Rutas para usuarios cajeros */}

      <Route element={<ProtectedCashier/>}>

      <Route path="/cashier" element={<CashRegister/>} />
      
      </Route>

       {/* Rutas para usuarios cobradores */}

       <Route element={<ProtectedCollector/>}>

      <Route path="/collector" element={<CashCollector/>} />

      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* register  */}
      <Route path="/register" element={<Register />} />

      {/* forgot password  */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

       {/* Checkout */}
       <Route path="/checkout" element={<Checkout />} /> 

       {/* CheckoutNext */}
       <Route path="/checkout/next" element={<CheckoutNext />} /> 

        {/* Paymentsuccess*/}
      <Route path="/checkout/paymentsuccess" element={<PaymentSuccess />} /> 

      {/* PendingVerification*/}
      <Route path="/checkout/pendingverification" element={<PendingVerification />} /> 

       


      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default AppRouter;
