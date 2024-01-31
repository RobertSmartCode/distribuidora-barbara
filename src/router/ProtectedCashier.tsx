import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedCashier = () => {
  const { user } = useContext(AuthContext)!;
  const rolCashier = import.meta.env.VITE_ROL_CASHIER; 

  return (
    <>
      {user.rol === rolCashier ? <Outlet /> : <Navigate to="/" />}
    </>
  );
};

export default ProtectedCashier;
