import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Card, CardContent, IconButton, Tooltip, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { OrderOnline } from '../../../type/type';

const OrdersOnline: React.FC = () => {
    const [ordersOnline, setOrdersOnline] = useState<OrderOnline[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<OrderOnline['items'][0] | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 5;

    useEffect(() => {
        const firestore = getFirestore();
        const ordersCollection = collection(firestore, 'orders');
        
        const unsubscribe = onSnapshot(ordersCollection, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const completedTimestamp = data.completedTimestamp ? (data.completedTimestamp as Timestamp).toDate() : new Date();
                
                return {
                    id: doc.id,
                    ...data,
                    completedTimestamp: completedTimestamp,
                };
            }) as OrderOnline[];
            setOrdersOnline(ordersData);
        });
    
        return () => unsubscribe();
    }, []);

    const handleDetailsModalOpen = (product: OrderOnline['items'][0]) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    // Calcular índices de orden de páginas
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = ordersOnline.slice(indexOfFirstOrder, indexOfLastOrder);

    // Cambiar a la siguiente página
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Cambiar a la página anterior
    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    return (
        <Card
            sx={{
                width: '80%',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto', 
            }}
        >
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell variant="head" align="center">Cliente</TableCell>
                            <TableCell variant="head" align="center">Correo</TableCell>
                            <TableCell variant="head" align="center">Cantidad Total</TableCell>
                            <TableCell variant="head" align="center">Fecha</TableCell>
                            <TableCell variant="head" align="center">Ver Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentOrders.map((order) => (
                            <TableRow key={order.id} style={{ cursor: 'pointer' }}>
                                <TableCell align="center">{order.userData.firstName}</TableCell>
                                <TableCell align="center">{order.userData.email}</TableCell>
                                <TableCell align="center">{order.total}</TableCell>
                                <TableCell align="center">{order.completedTimestamp.toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver detalles">
                                        <IconButton onClick={() => handleDetailsModalOpen(order.items[0])}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <IconButton sx={{ fontSize: '32px', marginRight: '16px' }} onClick={prevPage} disabled={currentPage === 1}>
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography variant="body1" sx={{ marginRight: '16px' }}>
                    Página {currentPage}
                </Typography>
                <IconButton sx={{ fontSize: '32px' }} onClick={nextPage} disabled={indexOfLastOrder >= ordersOnline.length}>
                    <NavigateNextIcon />
                </IconButton>
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card style={{ width: '80%', margin: 'auto', marginTop: '5%', maxHeight: '80%', overflowY: 'auto' }}>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Detalles del Producto Seleccionado
                        </Typography>
                        {selectedProduct && (
                            <div>
                                <Typography variant="subtitle1" gutterBottom>{selectedProduct.title}</Typography>
                                <Typography variant="body1">Precio: {selectedProduct.price}</Typography>
                                {selectedProduct.images && (
                                    <img src={selectedProduct.images} alt={selectedProduct.title} style={{ width: '50px', height: '50px' }} />
                                )}
                                <Button variant="contained" onClick={() => setModalOpen(false)}>Cerrar Detalles</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Modal>

        </Card>
    );
};

export default OrdersOnline;
