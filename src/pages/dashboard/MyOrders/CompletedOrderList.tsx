import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Box, Typography, Modal, CardContent, Button, Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { CompletedOrderbox } from '../../../type/type';

const CompletedOrderList: React.FC = () => {
    const [completedOrders, setCompletedOrders] = useState<CompletedOrderbox[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<CompletedOrderbox | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 5;
    const maxTitleLength = 25;
    const [clickedProduct, setClickedProduct] = useState<string | null>(null);

    const handleTitleClick = (title: string) => {
        setClickedProduct((prevClickedProduct) =>
            prevClickedProduct === title ? null : title
        );
    };

    useEffect(() => {
        const firestore = getFirestore();
        const completedOrdersCollection = collection(firestore, 'completedOrders');

        const unsubscribe = onSnapshot(completedOrdersCollection, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                completedTimestamp: (doc.data().completedTimestamp as Timestamp).toDate(),
            })) as CompletedOrderbox[];

            setCompletedOrders(ordersData);
        });

        return () => unsubscribe();
    }, []);

    const handleDetailsModalOpen = (order: CompletedOrderbox) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    // Calcular índices de orden de páginas
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = completedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
                <Table aria-label="completed-order-table">
                    <TableHead>
                        <TableRow>
                            <TableCell variant="head" align="center">DNI</TableCell>
                            <TableCell variant="head" align="center">Cantidad Total</TableCell>
                            <TableCell variant="head" align="center">Método de Pago</TableCell>
                            <TableCell variant="head" align="center">Fecha</TableCell>
                            <TableCell variant="head" align="center">Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell align="center">{order.customerId}</TableCell>
                                <TableCell align="center">{order.totalAmount}</TableCell>
                                <TableCell align="center">{order.paymentMethod}</TableCell>
                                <TableCell align="center">{order.completedTimestamp.toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver detalles">
                                        <IconButton onClick={() => handleDetailsModalOpen(order)}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*Modal*/}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card style={{ width: '20%', height: '100%', overflowY: "auto", margin:"auto", marginTop: 3 }}>
                <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {selectedOrder && (
                            <div>
                                <Typography variant="h6" style={{ marginTop: "10%" }} gutterBottom>Productos:</Typography>
                                {selectedOrder.products.map((product, index) => (
                                    <div key={index}>
                                        {product.images[0] && (
                                            <ListItemAvatar>
                                                <Avatar src={product.images[0]} alt={product.title} style={{ width: '50px', height: '50px', margin: '5px' }} />
                                            </ListItemAvatar>
                                        )}

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle1"
                                                    gutterBottom
                                                    sx={{
                                                        display: 'block',
                                                        maxWidth: '500px',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-all',
                                                        textTransform: 'uppercase',
                                                        cursor: 'pointer', // Cursor tipo "mano" al pasar el mouse
                                                    }}
                                                    onClick={() => handleTitleClick(product.title)}
                                                >
                                                    {clickedProduct === product.title
                                                        ? product.title
                                                        : product.title.length > maxTitleLength
                                                            ? product.title.substring(0, maxTitleLength) + "..."
                                                            : product.title
                                                    }
                                                </Typography>
                                            }
                                            secondary={`Precio: ${product.price} | Cantidad: ${product.quantity} | Código de Barra: ${product.barcode}`}
                                        />
                                    </div>
                                ))}
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%' }}>
                                    {selectedOrder && (
                                        <div>
                                            <Button variant="contained" onClick={() => setModalOpen(false)}>Cerrar Detalles</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Modal>


            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <IconButton sx={{ fontSize: '32px', marginRight: '16px' }} onClick={prevPage} disabled={currentPage === 1}>
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography variant="body1" sx={{ marginRight: '16px' }}>
                    Página {currentPage}
                </Typography>
                <IconButton sx={{ fontSize: '32px' }} onClick={nextPage} disabled={indexOfLastOrder >= completedOrders.length}>
                    <NavigateNextIcon />
                </IconButton>
            </Box>
        </Card>
    );
};

export default CompletedOrderList;
