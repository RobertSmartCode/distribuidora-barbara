import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  Timestamp,
  onSnapshot,

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
// import { Order } from '../../type/type'; 
import { doc, deleteDoc, addDoc } from 'firebase/firestore';


export interface Product {
  id: string;
  title: string;
  quantity: number;
  price: number;
  // Agrega más propiedades según la estructura de tu producto
}

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  products: Product[]; 
}




const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const firestore = getFirestore();
    const ordersCollection = collection(firestore, 'ordersbox');
  
    // Obtener la función para dejar de escuchar cambios al desmontar el componente
    const unsubscribe = onSnapshot(ordersCollection, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate(),
      })) as Order[];
      setOrders(ordersData);
    });
  
    // Limpieza: dejar de escuchar cambios cuando el componente se desmonta
    return () => unsubscribe();
  }, []);
  

  const handlePaymentMethod = async () => {
    if (selectedOrder) {
      const firestore = getFirestore();
      const ordersCollection = collection(firestore, 'orders');
      const completedOrdersCollection = collection(firestore, 'completedOrders');
  
      try {
        // Mueve la orden a la colección 'completedOrders'
        await addDoc(completedOrdersCollection, {
          ...selectedOrder,
          paymentMethod,
          completedTimestamp: Timestamp.now(),
        });
  
        // Elimina la orden de la colección 'orders'
        await deleteDoc(doc(ordersCollection, selectedOrder.id));
  
        console.log(`Order ${selectedOrder.id} moved to completedOrders with payment method: ${paymentMethod}`);
        
        // Cierra el diálogo
        setOpenDialog(false);
        // Realiza cualquier otra lógica necesaria después de seleccionar el método de pago
      } catch (error) {
        console.error('Error handling payment method:', error);
      }
    }
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
            {/* Agrega más detalles según la estructura de tu orden */}
            <Typography variant="body1">
              DNI: {order.customerName}
            </Typography>
            <Typography variant="body1">
              Total Amount: {order.totalAmount}
            </Typography>
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
    </Grid>
  );
};

export default OrderList;


