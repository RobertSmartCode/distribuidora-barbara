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




// import { Link } from 'react-router-dom';
// import { useCategories } from '../../../../../../context/CategoriesContext';

// function MenuButton() {
//   const { categories } = useCategories();

//   if (!categories) {
//     return null; 
//   }

//   return (
//     <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '0px', paddingTop: '0px' }}>
//       {categories.map(category => (
//         <div key={category.id} style={{ marginRight: '20px' }}>
//           <Link to={`/category/${category.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
//             <div className="menu-button" style={{ cursor: 'pointer', color: 'black' }}>
//               {category.name}
//             </div>
//           </Link>
//           {category.subCategories && category.subCategories.length > 0 && (
//             <ul>
//               {category.subCategories.map(subcategory => (
//                 <li key={subcategory}>
//                   <Link to={`/subcategory/${subcategory}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                     {subcategory}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default MenuButton;

