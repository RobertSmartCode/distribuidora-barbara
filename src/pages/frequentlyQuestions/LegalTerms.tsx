
import { Grid, Typography, Box } from '@mui/material';
import Footer from '../../components/common/layout/Navbar/Footer/Footer';

const LegalTermsfrom = () => {
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'justify' }}>
      <Grid container spacing={2} sx={{ maxWidth: 800 }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Términos y Condiciones
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            1. Introducción
          </Typography>
          <Typography variant="body1" paragraph>
            Las presentes condiciones generales de uso de la página web, regulan los términos y condiciones de acceso y uso de ANANAPLUSSIZE.MITIENDANUBE.COM, propiedad de KIM CRISTINA PAOLA, con domicilio en MORÓN 3374, LOC B, y con CUIT: 23-39461246-4, en adelante, "la Empresa", que el usuario del Portal deberá leer y aceptar para usar todos los servicios e información que se facilitan desde el portal. El mero acceso y/o utilización del portal, de todos o parte de sus contenidos y/o servicios significa la plena aceptación de las presentes condiciones generales de uso.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            2. Condiciones de uso
          </Typography>
          <Typography variant="body1" paragraph>
            Las presentes condiciones generales de uso del portal regulan el acceso y la utilización del portal, incluyendo los contenidos y los servicios puestos a disposición de los usuarios en y/o a través del portal, bien por el portal, bien por sus usuarios, bien por terceros. No obstante, el acceso y la utilización de ciertos contenidos y/o servicios puede encontrarse sometido a determinadas condiciones específicas.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            3. Modificaciones
          </Typography>
          <Typography variant="body1" paragraph>
            La empresa se reserva la facultad de modificar en cualquier momento las condiciones generales de uso del portal. En todo caso, se recomienda que consulte periódicamente los presentes términos de uso del portal, ya que pueden ser modificados.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            4. Obligaciones del Usuario
          </Typography>
          <Typography variant="body1" paragraph>
            El usuario deberá respetar en todo momento los términos y condiciones establecidos en las presentes condiciones generales de uso del portal. De forma expresa el usuario manifiesta que utilizará el portal de forma diligente y asumiendo cualquier responsabilidad que pudiera derivarse del incumplimiento de las normas.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            5. Responsabilidad del portal
          </Typography>
          <Typography variant="body1" paragraph>
            El usuario conoce y acepta que el portal no otorga ninguna garantía de cualquier naturaleza, ya sea expresa o implícita, sobre los datos, contenidos, información y servicios que se incorporan y ofrecen desde el Portal.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            6. Propiedad intelectual e industrial
          </Typography>
          <Typography variant="body1" paragraph>
            Todos los contenidos, marcas, logos, dibujos, documentación, programas informáticos o cualquier otro elemento susceptible de protección por la legislación de propiedad intelectual o industrial, que sean accesibles en el portal corresponden exclusivamente a la empresa o a sus legítimos titulares y quedan expresamente reservados todos los derechos sobre los mismos.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            7. Legislación aplicable, jurisdicción competente y notificaciones
          </Typography>
          <Typography variant="body1" paragraph>
            Las presentes condiciones se rigen y se interpretan de acuerdo con las Leyes de la República Argentina. Para cualquier reclamación serán competentes los juzgados y tribunales de la CIUDAD. Todas las notificaciones, requerimientos, peticiones y otras comunicaciones que el Usuario desee efectuar a la Empresa titular del Portal deberán realizarse por escrito y se entenderá que han sido correctamente realizadas cuando hayan sido recibidas en la siguiente dirección: DOMICILIO
          </Typography>
        </Grid>
      </Grid>
    
    </Box>
      <Footer /> 
   </>
  );
}

export default LegalTermsfrom;
