import React from 'react';
import { Tooltip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppLink: React.FC = () => {
  const phoneNumber = '+59898724545';
  const message = 'Hola, quiero saber más sobre tu empresa.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    // Abre la URL de WhatsApp en una nueva ventana o pestaña
    window.open(whatsappURL, '_blank', 'noopener noreferrer');
  };
  
  return (
    <Tooltip title="Enviar mensaje por WhatsApp">
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick} // Maneja el clic de forma personalizada
        style={{
          backgroundColor: '#25d366',
          color: 'white',
          borderRadius: '50%',
          padding: '10px', // Ajusta el padding según sea necesario
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          textDecoration: 'none', // Elimina la subrayado del enlace
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaWhatsapp size={40} />
      </a>
    </Tooltip>
  );
};

export default WhatsAppLink;


