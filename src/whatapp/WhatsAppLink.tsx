import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppLink: React.FC = () => {
  const phoneNumber = '+59898724545';
  const message = 'Hola, quiero saber más sobre tu empresa.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <Tooltip title="Enviar mensaje por WhatsApp">
      <IconButton
        component="a"
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: '#25d366',
          color: 'white',
          borderRadius: '50%',
          marginRight: { xs: '8px', md: '16px' }, // Ajusta el margen derecho según sea necesario para mobile y desktop
          position: 'fixed',
          bottom: '20px', // Ajusta la distancia desde la parte inferior
          right: '20px', // Ajusta la distancia desde la derecha
          zIndex: 99, // Asegura que esté por encima de todo
        }}
      >
        <FaWhatsapp size={40} /> {/* Tamaño del icono aumentado */}
      </IconButton>
    </Tooltip>
  );
};

export default WhatsAppLink;
