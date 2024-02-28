import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { AuthContext } from "../../../context/AuthContext";
import 'firebase/firestore';

import {Order} from "../../../type/type"

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
        const newArr: Order[] = res.docs.map((order) => ({
          ...(order.data() as DocumentData),
          id: order.id,
        })) as Order[];
        setMyOrders(newArr);
      })
      .catch((error) => console.log(error));
  }, [user.email]);


  return (
    <div>
       <Typography variant="h6" style={{ textAlign: 'center' }}>Mis Compras </Typography>
      {myOrders.map((order) => (
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
                      {/* Asegúrate de que `product.images` y `product.unit_price` existan en tu estructura de datos */}
                      <Grid item xs={4}>
                        <img
                          src={product.images[0]} // Reemplaza por la URL de la imagen del producto
                          alt={product.title}
                          style={{
                            width: '80%',
                            maxHeight: '100px',
                            objectFit: 'contain',
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
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
              <Typography variant="body1" style={{ textAlign: 'right' }}>
                Sub Total (Sin Envío): ${order.total - order.shippingCost}
              </Typography>
              <Typography variant="body1" style={{ textAlign: 'right' }}>
                Costo de envío: ${order.shippingCost}
              </Typography>
              <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                Total: ${order.total}
              </Typography>
            </Grid>

            <Typography variant="h6">
              Fecha: {order.date.toLocaleString()} 
            </Typography>

          </CardContent>
        </Card>
      ))}
    </div>
  );


};

export default UserOrders;
