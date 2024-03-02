import React, { useEffect, useState, useRef, ForwardedRef, forwardRef } from 'react';
import {
  getFirestore,
  collection,
  Timestamp,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  runTransaction
} from 'firebase/firestore';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress // Agregamos CircularProgress
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';

import { Orderbox, CompletedOrderbox, } from '../../type/type';

interface OrderPrintComponentProps {
  order: Orderbox | null;
}

const OrderPrintComponent: React.FC<OrderPrintComponentProps & { ref: ForwardedRef<HTMLDivElement> }> = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <Card ref={ref}>
      <CardContent>
        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>Orden a Imprimir</Typography>
        <Typography variant="body1">DNI: {order.customerName}</Typography>
        <Typography variant="body1">Total: {order.totalAmount}</Typography>
        <Typography variant="body1">
          Productos:
          <List>
            {order.products.map((product) => (
              <ListItem key={product.id}>
                <ListItemAvatar>
                  <Avatar alt={product.title} src={product.images[0]} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.title}
                  secondary={`Cantidad: ${product.quantity} - Precio: ${product.price}`}
                />
              </ListItem>
            ))}
          </List>
        </Typography>
      </CardContent>
    </Card>
  );
});

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Orderbox[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Orderbox | null>(null);
  const [selectedCompletedOrders, setSelectedcompletedOrders] = useState<CompletedOrderbox | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogPrinte, setOpenDialogPrinte] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Estado para indicar que se están ejecutando procesos
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firestore = getFirestore();
    const ordersCollection = collection(firestore, 'ordersbox');

    const unsubscribe = onSnapshot(ordersCollection, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate(),
      })) as Orderbox[];
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handlePaymentMethod = async () => {
    if (selectedOrder && selectedOrder.id) {
      const firestore = getFirestore();
      const ordersCollection = collection(firestore, 'ordersbox');
      const completedOrdersCollection = collection(firestore, 'completedOrders');

      try {
        setLoading(true); // Activamos el indicador de carga al iniciar el proceso

        for (const product of selectedOrder.products) {
          if (product.id) {
            const productRef = await doc(collection(firestore, 'products'), product.id);

            await runTransaction(firestore, async (transaction) => {
              const productDoc = await transaction.get(productRef);

              if (!productDoc.exists()) {
                throw new Error(`El producto ${product.title} (ID: ${product.id}) no existe en la base de datos.`);
              }

              const productData = productDoc.data();
              const updatedQuantity = productData.quantities - product.quantity;
              const updatedSalesCount = productData.salesCount + product.quantity;
              const updatedStockAccumulation = updatedQuantity + updatedSalesCount;

              transaction.update(productRef, { 
                quantities: updatedQuantity,
                salesCount: updatedSalesCount,
                stockAccumulation: updatedStockAccumulation
              });
              
            });
          } else {
            throw new Error('El id del producto está vacío o no definido.');
          }
        }

        await addDoc(completedOrdersCollection, {
          ...selectedOrder,
          paymentMethod,
          completedTimestamp: Timestamp.now(),
        });

        setSelectedcompletedOrders({
          ...selectedOrder,
          paymentMethod,
          completedTimestamp: new Date(Timestamp.now().toMillis()),
        });

        await deleteDoc(doc(ordersCollection, selectedOrder.id));

        setOpenDialogPrinte(true);
        setOpenDialog(false);
      } catch (error) {
        console.error('Error handling payment method:', error);
      } finally {
        setLoading(false); // Desactivamos el indicador de carga al finalizar el proceso
      }
    } else {
      console.error('selectedOrder o su propiedad "id" es nula o vacía');
    }
  };



  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleClosePrint = () => {
    setSelectedcompletedOrders(null);
    setOpenDialogPrinte(false);
  };

  return (
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid key={order.id} item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ width: '100%', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orden
              </Typography>
              <Typography variant="body1">DNI: {order.customerName}</Typography>
              <Typography variant="body1">Total: {order.totalAmount}</Typography>
              <Typography variant="body1">
                Productos:
                <List>
                  {order.products.map((product) => (
                    <ListItem key={product.id}>
                      <ListItemAvatar>
                        <Avatar alt={product.title} src={product.images[0]} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${product.title}`}
                        secondary={`Cantidad: ${product.quantity} | Precio: $${product.price * product.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  setSelectedOrder(order);
                  setOpenDialog(true);
                }}
              >
                Selecciona método de Pago
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Selecciona método de Pago</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="payment-method-label">Métodos de Pago</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as string)}
            >
              <MenuItem value="cash">Efectivo</MenuItem>
              <MenuItem value="debit">Débito</MenuItem>
              <MenuItem value="credit">Crédito</MenuItem>
              <MenuItem value="transfer">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handlePaymentMethod}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogPrinte} onClose={handleClosePrint}>
        <OrderPrintComponent order={selectedCompletedOrders} ref={componentRef} />
        <Button variant="contained" onClick={handlePrint}>Imprimir Orden</Button>
        <Button onClick={handleClosePrint}>Cancelar</Button>
      </Dialog>

      {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      )}
    </Grid>
  );
};

export default OrderList;
