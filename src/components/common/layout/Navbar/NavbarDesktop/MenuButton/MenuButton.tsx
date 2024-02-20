import Products from './Products';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import { Grid } from '@mui/material';

const MenuButton = () => {

 return (
    <Grid container spacing={2} justifyContent="center">
      {/* Componente de Products */}
      <Grid item sx={{ margin: '0 5px' }}>
      <FrequentlyAskedQuestions />
       
      </Grid>
      
      {/* Componente de Frequently Asked Questions */}
      <Grid item sx={{ margin: '0 5px' }}>
      <Products />
      </Grid>
    </Grid>
  );
}

export default MenuButton;


// const menuRef = useRef<HTMLDivElement>(null);
// const menuTopPositionRef = useRef<number>(0);

// useEffect(() => {
//   const handleMenuMouseLeave = (event: MouseEvent) => {
//     if (event.clientY < menuTopPositionRef.current) {
//       handleMenuClose();
//     }
//   };

//   document.addEventListener('mousemove', handleMenuMouseLeave);

//   return () => {
//     document.removeEventListener('mousemove', handleMenuMouseLeave);
//   };
// }, []);
