
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function ShoppingCart() {
  // Lógica y diseño del ícono del carrito aquí
  return (
    <IconButton color="inherit" className="shopping-cart-icon" sx={{ marginRight: 4 }}>
      <ShoppingCartIcon sx={{ fontSize: 46 }} />
    </IconButton>
  );
}

export default ShoppingCart;
