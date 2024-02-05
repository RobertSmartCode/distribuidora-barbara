import React, { useEffect, useState, useRef, ForwardedRef, forwardRef } from 'react';
import {
  getFirestore,
  collection,
  Timestamp,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
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
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';

export interface Productbox {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Orderbox {
  id: string;
  customerName: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  products: Productbox[];
}
export interface CompletedOrderbox {
  id: string;
  customerName: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  products: Productbox[];
  paymentMethod: string;
}


interface OrderPrintComponentProps {
  order: Orderbox | null;
}

const OrderPrintComponent: React.FC<OrderPrintComponentProps & { ref: ForwardedRef<HTMLDivElement> }> = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref}>
      <Typography variant="h6">Orden a Imprimir</Typography>
      <Typography variant="body1">DNI: {order.customerName}</Typography>
      <Typography variant="body1">Total: {order.totalAmount}</Typography>
      <Typography variant="body1">
        Productos:
        <ul>
          {order.products.map((product) => (
            <li key={product.id}>
              {product.title} - Cantidad: {product.quantity} - Precio: {product.price}
            </li>
          ))}
        </ul>
      </Typography>
    </div>
  );
});

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Orderbox[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Orderbox | null>(null);
  const [selectedCompletedOrders, setSelectedcompletedOrders] = useState<CompletedOrderbox| null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogPrinte, setOpenDialogPrinte] = useState<boolean>(false);
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
    if (selectedOrder) {
      const firestore = getFirestore();
      const ordersCollection = collection(firestore, 'ordersbox');
      const completedOrdersCollection = collection(firestore, 'completedOrders');
      
      try {
        await addDoc(completedOrdersCollection, {
          ...selectedOrder,
          paymentMethod,
          completedTimestamp: Timestamp.now(),
        });
  
        // Corrección aquí: Cambié "setSelectedcompletedOrders" a "setSelectedCompletedOrders"
        setSelectedcompletedOrders({
        ...selectedOrder,
        paymentMethod,
        completedTimestamp: new Date(Timestamp.now().toMillis()), // Convertir a Date
        });

  
        await deleteDoc(doc(ordersCollection, selectedOrder.id));
  
        console.log(`Order ${selectedOrder.id} moved to completedOrders with payment method: ${paymentMethod}`);
  
        // Corrección aquí: Cambié "setOpenDialogPrinte" a "setOpenDialogPrint"
        setOpenDialogPrinte(true);
        setOpenDialog(false);
      } catch (error) {
        console.error('Error handling payment method:', error);
      }
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
                <ul>
                  {order.products.map((product) => (
                    <li key={product.id}>
                      {product.title} - Cantidad: {product.quantity} - Precio: {product.price}
                    </li>
                  ))}
                </ul>
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
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
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
        
        {/* Componente oculto para imprimir */}
        <OrderPrintComponent order={selectedCompletedOrders} ref={componentRef} />
        <Button onClick={handlePrint}>Imprimir Orden </Button>
        <Button onClick={handleClosePrint}>Cancelar</Button>
      </Dialog>
    </Grid>
  );
};

export default OrderList;
