import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  Timestamp
 
} from 'firebase/firestore';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Order } from '../../../type/type'; // Asegúrate de importar el tipo adecuado

const OrdersOnline: React.FC = () => {
    const [ordersOnline, setOrdersOnline] = useState<Order[]>([]);
  
    useEffect(() => {
        const firestore = getFirestore();
        const ordersCollection = collection(firestore, 'orders');
        
        const unsubscribe = onSnapshot(ordersCollection, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const completedTimestamp = data.completedTimestamp ? (data.completedTimestamp as Timestamp).toDate() : new Date(); // Ajustar la fecha
            
            return {
              id: doc.id,
              ...data,
              completedTimestamp: completedTimestamp,
            };
          }) as Order[];
          setOrdersOnline(ordersData);
        });
    
        return () => unsubscribe();
      }, []);
      
      
  
    useEffect(() => {
        if (ordersOnline.length > 0) {
          const firstOrder = ordersOnline[0];
          
      
          console.log("Propiedades de la primera orden:");
          console.log("ID:", firstOrder.id);
          console.log("Tipo de Pago:", firstOrder.paymentType);
          console.log("Artículos:", firstOrder.items);
        
          console.log("Número de Usuario:", firstOrder.userData.phone);
          console.log("Nombre:", `${firstOrder.userData.firstName} ${firstOrder.userData.lastName}`);
          console.log("Correo:", firstOrder.userData.email);
        }
      }, [ordersOnline]);
      
  
    return (
      <Grid container spacing={2}>
        {ordersOnline.map((order) => (
          <Grid key={order.id} item xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Orden Online
                </Typography>
                <Typography variant="body1">
                  Cliente: {order.userData.firstName}
                </Typography>
                <Typography variant="body1">
                  Correo: {order.userData.email}
                </Typography>
                <Typography variant="body1">
                  Cantidad Total: {order.total}
                </Typography>
                <Typography variant="body2">
                Fecha: {order.completedTimestamp.toLocaleString()}
              </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  export default OrdersOnline;


