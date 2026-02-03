import OrderList from '../features/orders/OrderList';
import Header from '../components/layout/Header';

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <OrderList />
      </div>
    </div>
  );
};

export default OrdersPage;
