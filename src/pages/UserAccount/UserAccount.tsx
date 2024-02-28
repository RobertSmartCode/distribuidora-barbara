import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { AuthContext } from "../../context/AuthContext";
import 'firebase/firestore';

import {Order} from "../../type/type"

const UserOrders : React.FC = () => {
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    const ordersFiltered = query(
      ordersCollection,
      where("userData.email", "==", user.email)
    );

    getDocs(ordersFiltered)
    .then((res) => {
      const newArr: Order[] = res.docs.map((order) => {
        const orderData = order.data() as DocumentData;
        const completedTimestamp = orderData.completedTimestamp ? (orderData.completedTimestamp as Timestamp).toDate() : new Date(); // Ajustar la fecha
        return {
          ...orderData,
          id: order.id,
          completedTimestamp: completedTimestamp,
        };
      }) as Order[];
      setMyOrders(newArr);
    })
    .catch((error) => console.log(error));
  
  }, [user.email]);




 

  return (
    <div>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Mis Compras </Typography>
      {myOrders.map((order) => {
     
        
        return (
          <Card key={order.id} style={{ marginTop: '10px' }}>
            <CardContent>
              <Typography variant="h6"  style={{ textAlign: 'center' }}>
                Detalles de la orden
              </Typography>
              <Box>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={7}>
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: 'right' }}>  
                  </Grid>
                </Grid>
              </Box>
              <Grid item xs={12}>
              </Grid>
              {order.items.map((product) => (
                <Grid item xs={12} key={product.id}>
                  <Card>
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <img
                            src={product.images[0]} 
                            alt={product.title}
                            style={{
                              width: '80%',
                              maxHeight: '100px',
                              objectFit: 'contain',
                            }}
                          />
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'center' }}>
                          <Typography variant="body2">
                            {product.title} x {product.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'right' }}>
                          <Typography variant="body1">
                            ${product.price * product.quantity}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} style={{ marginTop: '20px' }}>
               
                <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  Total: ${Math.round(order.total)}
                </Typography>
              </Grid>
              <Typography variant="body2">
                Fecha: {order.completedTimestamp.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
  


};

export default UserOrders;
