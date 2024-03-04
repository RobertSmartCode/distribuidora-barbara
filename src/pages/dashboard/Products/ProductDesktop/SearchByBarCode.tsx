import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useBarcodeContext } from '../../../../context/BarcodeContext'; // Reemplaza 'ruta/a/BarcodeContext' con la ruta correcta

const SearchByBarCode: React.FC = () => {
  const { updateBarcodeKeyword } = useBarcodeContext();
  const [autoBarcode, setAutoBarcode] = useState<string>('');
  const [manualBarcode, setManualBarcode] = useState<string>('');

  // Función para manejar cambios en el código de barras automático
  const handleAutoBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoBarcode(event.target.value);
  };

  // Función para manejar cambios en el código de barras manual
  const handleManualBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualBarcode(event.target.value);
  };

  // Función para manejar la búsqueda manual
  const handleManualScan = () => {
    updateBarcodeKeyword(manualBarcode.trim());
  };

  // Efecto para actualizar el contexto del código de barras automáticamente
  useEffect(() => {
    if (!manualBarcode.trim()) {
      updateBarcodeKeyword(autoBarcode.trim());
    }
  }, [autoBarcode, manualBarcode, updateBarcodeKeyword]);
  

  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center" textAlign="center">
     <Grid item xs={12}>
        <TextField
          type="text"
          value={autoBarcode}
          onChange={handleAutoBarcodeChange}
          label="Código de barra (Búsqueda automática)"
          autoComplete="off"
          sx={{ mx: 'auto', width: '90%' }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          value={manualBarcode}
          onChange={handleManualBarcodeChange}
          label="Ingrese código de barra manualmente"
          autoComplete="off"
          sx={{ mx: 'auto', width: '90%' }}
        />
      </Grid>
     
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleManualScan} sx={{ mx: 'auto', mt: 2 ,marginBottom: "2%", width: '90%' }}>
          Búsqueda Manual
        </Button>
      </Grid>
    </Grid>
  );
  
};

export default SearchByBarCode;
