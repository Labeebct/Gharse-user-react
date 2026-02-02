import Header from '../components/layout/Header';
import Cart from '../features/cart/Cart';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Cart />
      </main>
    </div>
  );
};

export default CartPage;
