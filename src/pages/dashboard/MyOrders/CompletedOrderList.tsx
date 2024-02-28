import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  Timestamp,
 
} from 'firebase/firestore';
import { Grid, Card, CardContent, Typography } from '@mui/material';

import { Order } from '../../../type/type'; 

const CompletedOrderList: React.FC = () => {

  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const firestore = getFirestore();
    const completedOrdersCollection = collection(firestore, 'completedOrders');

    // Obtener la función para dejar de escuchar cambios al desmontar el componente
    const unsubscribe = onSnapshot(completedOrdersCollection, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            completedTimestamp: (doc.data().completedTimestamp as Timestamp).toDate(),
          })) as any[];
          
      setCompletedOrders(ordersData);
    });

    // Limpieza: dejar de escuchar cambios cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <Grid container spacing={2}>
      {completedOrders.map((order) => (
        <Grid key={order.id} item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ width: '100%', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orden Completada
              </Typography>
              {/* Agrega más detalles según la estructura de tu orden completada */}
              <Typography variant="body1">
                DNI: {order.customerName}
              </Typography>
              <Typography variant="body1">
                Total Amount: {order.totalAmount}
              </Typography>
              {/* Ahora TypeScript debería reconocer la propiedad `completedTimestamp` */}
              <Typography variant="body2">
                Completada el: {order.completedTimestamp.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CompletedOrderList;
