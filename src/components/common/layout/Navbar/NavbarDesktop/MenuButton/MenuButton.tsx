import { Link } from 'react-router-dom';

function MenuButton() {
  return (
    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '0px', paddingTop: '0px' }}>
      <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
        <div className="menu-button" style={{ cursor: 'pointer', color: 'black' }}>
          Tienda
        </div>
      </Link>
    </div>
  );
}

export default MenuButton;
