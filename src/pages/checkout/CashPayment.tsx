import { useState, useEffect, useContext } from 'react';
import { Snackbar, Tooltip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';
import { collection, addDoc, Timestamp,  runTransaction, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';
import { db } from '../../firebase/firebaseConfig';
import { Product } from '../../type/type';
import { DocumentReference } from 'firebase/firestore';

const CashPayment = () => {
  const { customerInfo } = useCustomer()!;
  const { cart, clearCart, getTotalPrice } = useContext(CartContext)! || {};
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [whatsappURL, setWhatsappURL] = useState('');
  const navigate = useNavigate();
  const phoneNumber = '+59898724545';

  useEffect(() => {

    const generateWhatsAppURL = () => {
      const message = `¡Nueva orden!\n\nTeléfono: ${userData.phone}\nCliente: ${
        userData.firstName
      }\nDirección de entrega: CP:${userData.postalCode}, ${userData.city}, ${userData.department}, ${userData.streetAndNumber}\n\nProductos:\n${cart
        .map(
          (product) =>
            `${product.title} - Tipo: ${product.type}, Barcode: ${
              product.barcode
            }, Precio: ${product.price}, Cantidad: ${
              product.quantity
            }, Total: ${product.price * product.quantity}\n`
        )
        .join('')}`;
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

    setWhatsappURL(generateWhatsAppURL()); 

  }, []); 

  const total = getTotalPrice ? getTotalPrice() : 0;
  const userData = customerInfo!;


  const handleOrder = async () => {
    const order = {
      userData,
      items: cart,
      total,
      completedTimestamp: new Date(Timestamp.now().toMillis()),
      status: 'pending',
      paymentType: 'efectivo',
    };
  
    const ordersCollection = collection(db, 'orders');
  
    try {
      // Agregar la orden a la colección de órdenes
 
      await addDoc(ordersCollection, {
        ...order,
      });
  
      // Restar la cantidad de productos vendidos de la base de datos
  
      await updateProductQuantities(cart);
  
      // Navegar a la siguiente página y mostrar un mensaje de éxito
     
      navigate('/checkout/pendingverification');
      setSnackbarMessage('Orden generada con éxito.');
      setSnackbarOpen(true);
      clearCart();
    } catch (error) {
      console.error('Error al generar la orden:', error);
      setUploadMessage('Error al generar la orden.');
    }
  };


  const updateProductQuantities = async (products: Product[]) => {
    const productRefs = products.map(product => doc(collection(db, 'products'), product.id));
    await Promise.all(productRefs.map(async (productRef, index) => {
      const product = products[index];
     
      const cartProduct = cart.find(cartItem => cartItem.barcode === product.barcode);
      if (!cartProduct) {
        throw new Error(`No se encontró el producto ${product.title} (ID: ${product.id}) en el carrito de compras.`);
      }
      await updateProductQuantityInTransaction(productRef, cartProduct.quantity);
    }));
  };
  
const updateProductQuantityInTransaction = async (productRef: DocumentReference, quantity: number) => {
  await runTransaction(db, async (transaction) => {
    const productDoc = await transaction.get(productRef);
    if (!productDoc.exists()) {
      throw new Error('¡El producto no existe!');
    }
    const productData = productDoc.data();
    const updatedQuantity = productData.quantities - quantity;
    const updatedSalesCount = productData.salesCount + quantity;
    const updatedStockAccumulation = updatedQuantity + updatedSalesCount;

    if (updatedQuantity < 0) {
      throw new Error('¡Cantidad insuficiente disponible!');
    }

    transaction.update(productRef, { 
      quantities: updatedQuantity,
      salesCount: updatedSalesCount,
      stockAccumulation: updatedStockAccumulation
    });
  });
};




  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
      <h2 style={{ color: 'black' }}>Mandar el Pedido por WhatsApp</h2>
      <Tooltip title="Enviar mensaje por WhatsApp">
        <a
          href={whatsappURL} // Establece la URL generada para WhatsApp
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#25d366',
            color: 'white',
            borderRadius: '8px', // Ajusta el radio de los bordes según sea necesario
            padding: '10px 20px', // Ajusta el padding horizontal y vertical según sea necesario
            textDecoration: 'none',
            display: 'block', // Cambia a bloque para permitir el centrado horizontal
            margin: '0 auto', // Centra horizontalmente
            maxWidth: '20%', // Establece el ancho máximo al 20% del contenedor
            zIndex: 99,
          }}
          onClick={handleOrder}
        >
          <FaWhatsapp size={40} />
        </a>
      </Tooltip>

      <p>{uploadMessage}</p>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export { CashPayment };
