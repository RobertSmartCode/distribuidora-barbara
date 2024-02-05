interface OrderPrintComponentProps {
  order: Orderbox;
}

export interface Productbox {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }
  
  export interface Orderbox {
    id: string;
    customerName: string;
    totalAmount: number;
    timestamp: Date;
    completedTimestamp: Date;
    products: Productbox[];
  }
  

const OrderPrintComponent: React.FC<OrderPrintComponentProps> = ({ order }) => {
  if (!order) return null;

  return (
    <div>
      <div>
        <div style={{ fontSize: "20px", color: "green" }}>
          DNI: {order.customerName}
        </div>
        <div style={{ fontSize: "20px", color: "green" }}>
          Total: {order.totalAmount}
        </div>
        <div style={{ fontSize: "20px", color: "green" }}>
          Productos:
          <ul>
            {order.products.map((product) => (
              <li key={product.id}>
                {product.title} - Cantidad: {product.quantity} - Precio: {product.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderPrintComponent;
