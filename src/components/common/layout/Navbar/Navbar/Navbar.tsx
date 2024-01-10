import { useState, useEffect } from "react";
import NavbarMobile from '../NavbarMobile/NavbarMobile';
import NavbarDesktop from '../NavbarDesktop/NavbarDesktop';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Función para actualizar el estado de isMobile cuando cambie el tamaño de la ventana
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    // Agregar un event listener para detectar cambios en el tamaño de la ventana
    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app">
      {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
      {/* Resto de tu contenido de la aplicación */}
    </div>
  );
}

export default App;

