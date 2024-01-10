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
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { Tooltip } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const PromoCodeList: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<any>(null);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const promoCodesCollection = collection(db, 'promoCodes');
        const querySnapshot = await getDocs(promoCodesCollection);
        const codes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPromoCodes(codes);
      } catch (error) {
        console.error('Error al obtener los códigos de descuento:', error);
      }
    };

    fetchPromoCodes();
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

  // Función para calcular la fecha de vencimiento
  const calculateExpirationDate = (createdAt: Date, durationInDays: number): string => {
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + durationInDays);
    return expirationDate.toLocaleString();
  };

  return (
    <div>
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
                            fontSize="small" // Ajusta el tamaño del ícono según tus preferencias
                            style={{ marginLeft: '4px' }} // Agrega espacio entre el texto y el ícono
                        />
                        </span>

                    </Tooltip>
                }
                secondary={`Porcentaje de Descuento: ${code.discountPercentage}% | Fecha de Vencimiento: ${calculateExpirationDate(
                    code.createdAt.toDate(),
                    code.duration
                )}`}
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
