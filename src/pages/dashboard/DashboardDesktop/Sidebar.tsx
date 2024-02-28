import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useSelectedItemsContext } from '../../../context/SelectedItems'; // Asegúrate de que la ruta sea correcta

// Importa tus iconos aquí
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import ListIcon from '@mui/icons-material/List';
import StorefrontIcon from '@mui/icons-material/Storefront';

// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { updateSelectedItems } = useSelectedItemsContext();

  const handleItemClick = (itemName: string) => {
    // Actualiza el contexto con la nueva selección
    updateSelectedItems([{ name: itemName }]);
  };
  

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/" >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('Ordenes Caja')}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Ordenes Caja" />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('Ordenes Online')}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Ordenes Online" />
        </ListItem>
        <ListItem button  onClick={() => handleItemClick('Agregar Producto')}>
          <ListItemIcon>
            <AddShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Agregar Producto" />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('Mis Productos')}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Mis Productos" />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('Métodos de Pago')}>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Métodos de Pago" />
        </ListItem>
       
        <ListItem button onClick={() => handleItemClick('Datos de la Tienda')}>
          <ListItemIcon>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary="Datos de la Tienda" />
        </ListItem>
       
        {/* <ListItem button  onClick={() => handleItemClick('Reportes de Ventas')}>
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Reportes de Ventas" />
        </ListItem> */}
        <ListItem button  onClick={() => handleItemClick('Categorías')}>
          <ListItemIcon>
          <ListIcon />
            
          </ListItemIcon>
          <ListItemText primary="Categorías" />
        </ListItem>

         <ListItem button onClick={() => handleItemClick('Configuración')}>
        <ListItemIcon>
        <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Configuración" />
        </ListItem>
        
      </List>
    </Drawer>
  );
};

export default Sidebar;
