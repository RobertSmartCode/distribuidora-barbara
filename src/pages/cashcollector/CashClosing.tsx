import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

interface CompletedOrder {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  completedTimestamp: Date;
}

const CashClosing: React.FC = () => {
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [paymentTotals, setPaymentTotals] = useState<{ [key: string]: number }>({});
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const firestore = getFirestore();
        const ordersCollection = collection(firestore, 'completedOrders');
        const unsubscribe = onSnapshot(ordersCollection, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            completedTimestamp: (doc.data().completedTimestamp as any).toDate(),
          })) as CompletedOrder[];
          setCompletedOrders(ordersData);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      }
    };

    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    // Calcular el total de ingresos desde el hora de apertura hasta el cierre
    const income = completedOrders.reduce((total, order) => total + order.totalAmount, 0);
    setTotalIncome(income);

    // Calcular los montos en cada método de pago
    const paymentTotalsObj: { [key: string]: number } = {};
    completedOrders.forEach((order) => {
      if (paymentTotalsObj[order.paymentMethod]) {
        paymentTotalsObj[order.paymentMethod] += order.totalAmount;
      } else {
        paymentTotalsObj[order.paymentMethod] = order.totalAmount;
      }
    });
    setPaymentTotals(paymentTotalsObj);
  }, [completedOrders]);

  const handleCloseCash = () => {
    setShowContent(true);
  };

  const handleFinalClose = () => {
    // Lógica para cerrar la caja
    // Esto puede incluir la generación de un informe, la limpieza de la base de datos, etc.
    setShowContent(false);
  };

  return (
    <>
      <Button
        style={{ position: 'absolute', top: "4%", right: "1%" }}
        onClick={handleCloseCash}
        color="primary"
        size="small"
      >
        <PowerSettingsNewIcon />
      </Button>
      {showContent && (
        <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Cierre de Caja
            </Typography>
  
            {/* Mostrar el total de ingresos */}
            <Typography variant="body1" align="center" gutterBottom>
              Total de Ingresos: ${totalIncome.toFixed(2)}
            </Typography>
  
            {/* Mostrar los montos en cada método de pago */}
            <Typography variant="h6" align="center" gutterBottom>
              Montos por Método de Pago:
            </Typography>
            <List>
              {Object.entries(paymentTotals).map(([method, amount]) => (
                <ListItem key={method} disablePadding>
                  <ListItemText primary={`${method === 'cash' ? 'Efectivo' : method === 'transfer' ? 'Transferencia' : method === 'debit' ? 'Débito' : method}: $${amount.toFixed(2)}`} />
                </ListItem>
              ))}
            </List>
  
            {/* Botón para cerrar la caja */}
            <Button variant="contained" color="primary" fullWidth onClick={handleFinalClose}>
              Cerrar Caja
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
  
  
};

export default CashClosing;
