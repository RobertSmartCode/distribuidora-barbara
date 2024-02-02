import React, { useState } from 'react';
import { Button, Box, } from '@mui/material';
import PromoCodeForm from "./PromoCodeForm"
import PromoCodeList from "./PromoCodeList"




const PromoCodeDesktop: React.FC = () => {

  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateCouponClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Box style={{  textAlign: 'center' }}>
     
        <div style={{ margin: '0 auto', textAlign: 'center', marginTop:"20px", marginBottom:"20px" }}>
            <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCouponClick}
             >
            {showForm ? 'Cerrar Formulario' : 'Crear Cupón'}
          </Button>
          {showForm && <PromoCodeForm />}
        </div>
       
        <PromoCodeList/>
     
    </Box>
  );
};

export default PromoCodeDesktop;
