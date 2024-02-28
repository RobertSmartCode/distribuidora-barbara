import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import {
  getDocs,
  collection,
  DocumentData,
} from "firebase/firestore";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';

import 'firebase/firestore';
import {Order} from "../../../type/type"

const UserOrders : React.FC = () => {
  const [myOrders, setMyOrders] = useState<Order[]>([]);
 
  useEffect(() => {
    const ordersCollection = collection(db, "orders");
   

    getDocs(ordersCollection)
      .then((res) => {
        const newArr: Order[] = res.docs.map((order) => ({
          ...(order.data() as DocumentData),
          id: order.id,
        })) as Order[];
        setMyOrders(newArr);
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <Box  style={{ padding: "0px", margin:"0px"}} >
       
      {myOrders.map((order) => (
          <Card key={order.id}  style={{ marginTop: '10px'}}>
                    <CardContent>
                      <Typography variant="h6" style={{ textAlign: 'center' }}>
                        Detalles de la orden
                      </Typography>
                      {/* Agregar detalles del cliente */}
                      <Typography variant="h6">
                        Cliente: {order.userData.firstName} {order.userData.lastName}
                      </Typography>
                      <Typography variant="body1">
                        Teléfono: {order.userData.phone}
                      </Typography>
                      <Typography variant="body1">
                        Documento de Identificación: {order.userData.identificationDocument}
                      </Typography>
                    
                      <Typography variant="body1">
                        Ciudad: {order.userData.city}
                      </Typography>
                      <Typography variant="body1">
                        Código Postal: {order.userData.postalCode}
                      </Typography>
                      <Typography variant="body1">
                        Teléfono: {order.userData.phone}
                      </Typography>
                      <Typography variant="body1">
                        Email: {order.userData.email}
                      </Typography>
                      {/* Fin de detalles adicionales del cliente */}
                      <Box>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item xs={7}></Grid>
                          <Grid item xs={2} style={{ textAlign: 'right' }}></Grid>
                        </Grid>
                      </Box>
                     

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
    </Box>
  );


};

export default UserOrders;
