import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { Tooltip } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const PromoCodeList: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<any>(null);



  useEffect(() => {
    // Suscribe a cambios en la colección 'promoCodes'
    const unsubscribe = onSnapshot(collection(db, 'promoCodes'), (snapshot) => {
      try {
        const codes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPromoCodes(codes);
      } catch (error) {
        console.error('Error al obtener los códigos de descuento:', error);
      }
    });
  
    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);
  


  

  const handleDelete = async (id: string) => {
    try {
      const promoCodeDoc = doc(db, 'promoCodes', id);
      await deleteDoc(promoCodeDoc);
      setPromoCodes((prevCodes) => prevCodes.filter((code) => code.id !== id));
    } catch (error) {
      console.error('Error al eliminar el código de descuento:', error);
    }
  };

  const handleDetailsClick = (code: any) => {
    setSelectedCodeDetails(code);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleCopyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // Puedes agregar una lógica adicional, como mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al copiar el código de descuento:', error);
      // Puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    }
  };

  return (
    <div style={{ margin: '10px auto', textAlign: 'center', marginTop: '20px', maxWidth: '800px' }}>
      <Typography variant="h5" gutterBottom>
        Lista de Códigos Generados
      </Typography>
      <List>
        {promoCodes.map((code) => (
          <div key={code.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Tooltip title="Clic para copiar">
                    <span
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={() => handleCopyToClipboard(code.promoCode)}
                    >
                      Código: {code.promoCode}{' '}
                      <FileCopyIcon
                        fontSize="small"
                        style={{ marginLeft: '4px' }}
                      />
                    </span>
                  </Tooltip>
                }
               
              />
  
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Eliminar"
                  onClick={() => handleDelete(code.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Ver Detalles"
                  onClick={() => handleDetailsClick(code)}
                >
                  <InfoIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
  
      {/* Detalles del código */}
      <Dialog open={showDetails} onClose={handleCloseDetails}>
        <DialogTitle>Detalles del Código</DialogTitle>
        <DialogContent>
          {selectedCodeDetails && (
            <div>
              <Typography>Fecha de Creación: {selectedCodeDetails.createdAt.toDate().toLocaleString()}</Typography>
              <Typography>Porcentaje de Descuento: {selectedCodeDetails.discountPercentage}%</Typography>
              <Typography>Duración: {selectedCodeDetails.duration} días</Typography>
              <Typography>Monto Mínimo de Compra: {selectedCodeDetails.minPurchaseAmount}</Typography>
              <Typography>Cantidad Máxima de Descuento: {selectedCodeDetails.maxDiscountAmount}</Typography>
              <Typography>Código: {selectedCodeDetails.promoCode}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PromoCodeList;
