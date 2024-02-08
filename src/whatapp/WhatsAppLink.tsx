import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppLink: React.FC = () => {
  const phoneNumber = '+59898724545';
  const message = 'Hola, quiero saber más sobre tu empresa.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Evita el comportamiento predeterminado de redireccionamiento
    event.preventDefault();
    // Abre la URL de WhatsApp en una nueva ventana o pestaña
    window.open(whatsappURL, '_blank', 'noopener noreferrer');
  };

  return (
    <Tooltip title="Enviar mensaje por WhatsApp">
      <IconButton
        component="a"
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick} // Maneja el clic de forma personalizada
        sx={{
          backgroundColor: '#25d366',
          color: 'white',
          borderRadius: '50%',
          marginRight: { xs: '8px', md: '16px' },
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99,
        }}
      >
        <FaWhatsapp size={40} />
      </IconButton>
    </Tooltip>
  );
};

export default WhatsAppLink;
