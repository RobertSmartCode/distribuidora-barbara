import React from 'react';
import ProductScanner from './ProductScanner'; // Ajusta la ruta según tu estructura de archivos
import CartList from './CartList'; // Ajusta la ruta según tu estructura de archivos


const CashRegister: React.FC = () => {
  return (
  
      <div >
        <ProductScanner />
        <CartList />
      </div>
    
  );
};

export default CashRegister;
