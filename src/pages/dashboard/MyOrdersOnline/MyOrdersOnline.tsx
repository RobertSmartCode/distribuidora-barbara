import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Card, CardContent, IconButton, Tooltip, Box, Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { OrderOnline } from '../../../type/type';

const OrdersOnline: React.FC = () => {
    const [ordersOnline, setOrdersOnline] = useState<OrderOnline[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderOnline | null>(null);
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

    const handleDetailsModalOpen = (product: OrderOnline) => {
        setSelectedOrder(product);
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
                <Card style={{ width: '50%', margin: 'auto', marginTop: '5%', maxHeight: '80%', overflowY: 'auto' }}>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Detalles del Pedido Seleccionado
                        </Typography>
                        {selectedOrder && (
                            <div>
                                <Typography variant="body1">Total: {selectedOrder.total}</Typography>
                                <Typography variant="body1">Tipo de Pago: {selectedOrder.paymentType}</Typography>
                                <Typography variant="body1">Email: {selectedOrder.userData.email}</Typography>
                                <Typography variant="body1">Recibe Ofertas: {selectedOrder.userData.receiveOffers ? 'Sí' : 'No'}</Typography>
                                <Typography variant="body1">País: {selectedOrder.userData.country}</Typography>
                                <Typography variant="body1">Documento de Identificación: {selectedOrder.userData.identificationDocument}</Typography>
                                <Typography variant="body1">Nombre: {selectedOrder.userData.firstName}</Typography>
                                <Typography variant="body1">Apellido: {selectedOrder.userData.lastName}</Typography>
                                <Typography variant="body1">Teléfono: {selectedOrder.userData.phone}</Typography>
                                <Typography variant="body1">Recibirá el envío otra Persona: {selectedOrder.userData.isOtherPerson ? 'Sí' : 'No'}</Typography>
                                {selectedOrder.userData.isOtherPerson && (
                                    <>
                                        <Typography variant="body1">Nombre de Otra Persona: {selectedOrder.userData.otherPersonFirstName}</Typography>
                                        <Typography variant="body1">Apellido de Otra Persona: {selectedOrder.userData.otherPersonLastName}</Typography>
                                    </>
                                )}
                                <Typography variant="body1">Calle y Número: {selectedOrder.userData.streetAndNumber}</Typography>
                                <Typography variant="body1">Departamento: {selectedOrder.userData.department}</Typography>
                                <Typography variant="body1">Barrio: {selectedOrder.userData.neighborhood}</Typography>
                                <Typography variant="body1">Ciudad: {selectedOrder.userData.city}</Typography>
                                <Typography variant="body1">Código Postal: {selectedOrder.userData.postalCode}</Typography>
                                <Typography variant="body1">Provincia: {selectedOrder.userData.province}</Typography>
                                <Typography variant="body1">Tipo de Cliente: {selectedOrder.userData.customerType}</Typography>
                                {selectedOrder.userData.customerType === 'invoice' && (
                                    <Typography variant="body1">CUIT/CUIL: {selectedOrder.userData.cuilCuit}</Typography>
                                )}
                                {selectedOrder.userData.customerType === 'invoice' && (
                                    <Typography variant="body1">Nombre de la Empresa: {selectedOrder.userData.businessName}</Typography>
                                )}
                                {selectedOrder.items.map((product, index) => (

                                    <div key={index}>
                                  <Typography variant="body1">Productos:</Typography>

                                      {product.images && product.images.length > 0 && (
                                            <ListItemAvatar>
                                                <Avatar src={product.images[0]} alt={product.title} style={{ width: '50px', height: '50px', margin: '5px' }} />
                                            </ListItemAvatar>
                                        )}

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body2"
                                                    gutterBottom
                                                    sx={{
                                                        display: 'block',
                                                        maxWidth: '500px',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-all',
                                                        textTransform: 'uppercase',
                                                        cursor: 'pointer',
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


                                
                            </div>
                           
                        )}
                    </CardContent>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Button variant="contained" onClick={() => setModalOpen(false)}>Cerrar Detalles</Button>
                              </CardContent>
                </Card>
            </Modal>


        </Card>
    );
};

export default OrdersOnline;
