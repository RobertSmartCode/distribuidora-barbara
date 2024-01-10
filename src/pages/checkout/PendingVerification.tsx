import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { useLocation } from "react-router-dom";


const PendingVerification = () => {
  
  const { isLogged } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const delay = 3000;
    setTimeout(() => {
      if (isLogged) {
        navigate("/user-orders");
      } else {
        navigate('/login?from=pendingverification');
      }
    }, delay);
  }, [location.search, isLogged, navigate]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        color: 'black',
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ fontWeight: 'bold' }}>Pago Pendiente de Verificación</h2>
    </div>
  );
};

export default PendingVerification;
