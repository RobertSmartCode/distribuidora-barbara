
import { Grid, Typography } from '@mui/material';
import Footer from '../../components/common/layout/Navbar/Footer/Footer';

const ShipmentTracking = () => {
  return (
    <>
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Typography variant="h4" align="center" gutterBottom>
          ENVÍO Y SEGUIMIENTO
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Por dónde se envían los pedidos?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Los pedidos se envían por el transporte que el cliente indique o haya seleccionado al momento de realizar la compra. Las opciones que figuran en el portal web son las siguientes:
        </Typography>
        <Typography component="ol" gutterBottom>
          <li>
            <strong>Correo Argentino:</strong>
            <Typography variant="body2" component="span">
              Para conocer el costo total, basta con colocar su código postal en el sector de envío, para que la página te informe el costo del servicio, el cuál varía según la región a donde se envíe y el peso total del paquete a enviar.
              <br />
              Se da a entender que el envío es a domicilio y se utilizarán los datos que el cliente haya cargado en la compra. En caso de querer que el envío se realice a una sucursal del correo, usted como cliente lo tiene que indicar por WhatsApp o mail una vez que el equipo de Ananá Plus Size se haya contactado para confirmar el pago del la compra. Además, deberá indicar la dirección de la sucursal que prefiera.
              <br />
              Una vez realizado el envío, se les informará por mail y mediante WhatsApp, el código de seguimiento, el cuál le permite a usted, como cliente, realizar el tracking o seguimiento de manera online en la página oficial de Correo Argentino. No en nuestro portal web.
              <br />
              Sin embargo, el local no se responsabiliza de ningún hurto o pérdida que sufra el pedido en manos de Correo Argentino o de terceros salvo que se abone el seguro propio del local, es decir, abone un seguro por se pedido.
              <br />
              <strong>IMPORTANTE:</strong> Si el paquete es devuelto al local por negligencia del cliente a recibirlo o a retirarlo por la sucursal de correo argentino, el mismo debe de abonar nuevamente un envío para poder reenviarlo.
            </Typography>
          </li>
          <li>
            <strong>Encomiendas o Transportes:</strong>
            <Typography variant="body2" component="span">
              La encomienda o transporte es a elección del Cliente, quién debe detallar en el sector de notas de la compra o mediante un mail, el nombre de la empresa o transporte que suele trabajar o prefiere que el local utilice para despachar su pedido. Los costos del mismo son ajenos al local, y deben ser abonados al momento en que Usted lo reciba o retire según corresponda, acorde a las tarifas que le indiquen dicha empresa.
              <br />
              Sin embargo, esta opción, presenta un costo, los cuáles abarcan el derivamiento del paquete a la empresa de transporte seleccionada, además de los gastos de embalaje del mismo.
              <br />
              Al seleccionar dicha opción, Usted como cliente debe informarle al local, el valor de seguro que quiere declarar y si el envío lo quiere a domicilio o a terminal/depósito, ya que el mismo, es decisión exclusiva del comprador. Una vez entregado el paquete a dichas empresas de transporte, el seguimiento del mismo, debe ser realizado por el comprador mediante los sitios webs correspondientes. Los comprobantes o guías de envío, serán brindados por WhatsApp o mail. Pero, una vez que el grupo de logística se haya llevado el paquete, se le informa al cliente y se le brinda el remito junto con la foto del paquete enviado.
              <br />
              El local no se responsabiliza de ningún hurto o pérdida que sufra el pedido en manos de la empresa de transporte o encomienda seleccionada por el cliente.
            </Typography>
          </li>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Cuándo despachan mi compra (una vez abonada)?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          PARA EL PREPARADO DEL PEDIDO EL LOCAL PUEDE TARDAR DE 1 A 7 DÍAS HÁBILES SEGÚN LA DEMANDA DE PEDIDOS QUE SE TENGA. NO SE PUEDEN ARMAR DE FORMA INMEDIATA.
          <br />
          Los envíos seleccionados por medio de Correo Argentino, son despachados de lunes a viernes. Una vez confirmado el pago de su compra, el personal de Ananá Plus Size, le estará informando dicho día.
          <br />
          Los envíos seleccionados por medio de Transportes o Encomiendas son despachados todos los días de lunes a viernes en los horarios de la mañana y tarde, salvo el día viernes, cuyo horario de envío concluye a las 12:00.
          <br />
          <strong>IMPORTANTE:</strong> Los días sábados, domingos y feriados no se despachan pedidos.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Cuánto demora en llegar el paquete?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          La demora del mismo es ajena al local y depende pura y exclusivamente del transporte que el cliente haya seleccionado, Para mayor información consultar con el transporte, con el cuál, el cliente desee que se realice el envío ya que varía según cada empresa.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Qué pasa si devuelven tu pedido al local?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          En caso de que devuelvan el paquete al local, el comprador puede pasar a retirarlo por el local, siempre en cuando haya coordinado con anticipación con el equipo de Ananá Plus Size o en caso de requerir de envío, se deberá abonar nuevamente el costo de envío sin excepción alguna.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>¿Qué pasa si se extravía un paquete?</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          En caso de elegir envío por Correo Argentino, el local te va a preguntar si quieres abonar un seguro sobre el valor de tu compra para que el local se responsabilice de tu pedido en caso de que Correo Argentino lo extravíe. Si no se abona el seguro, el local no se puede responsabilizar. Es importante confirmarle al local si se quiere o no utilizar el seguro, ya que si no recibe respuestas concretas, el pedido no se puede enviar.
          <br />
          Si elegiste otro medio de transporte que incluye los micros o expresos de larga distancia, le tienes que indicar al local el valor que le aseguras a la mercadería, ya que dichos métodos de envío, sí cuentan con seguro propio. Así, ante cualquier inconveniente, puedes reclamar el seguro a la empresa que hayas escogido. Puedes declarar el valor total, la mitad o el mínimo, según tu preferencia ya que en muchos casos, termina influyendo en el costo final de la tarifa de envío.
          <br />
          <strong>IMPORTANTE:</strong> Para cualquier tipo de reclamo, se debe realizar una grabación de cuando abren/rompen el embalaje hasta sacar la última prenda de la bolsa. La filmación o video no tiene que tener cortes ni ediciones. Sin excepción.
        </Typography>
      </Grid>
    </Grid>
    <Footer /> 
    </>
  );
}

export default ShipmentTracking;
