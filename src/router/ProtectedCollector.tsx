import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedCollector = () => {
  const { user } = useContext(AuthContext)!;
  const collectorRole = import.meta.env.VITE_ROL_COLLECTOR; 

  return (
    <>
      {user.rol === collectorRole ? <Outlet /> : <Navigate to="/" />}
    </>
  );
};

export default ProtectedCollector;
