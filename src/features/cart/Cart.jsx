import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, useUpdateCart, useRemoveFromCart } from './cart.hooks';
import { useCartSocket } from './cart.socket.hook';

const Cart = () => {
  const { data: cart, isLoading } = useCart();
  const updateCartMutation = useUpdateCart();
  const removeFromCartMutation = useRemoveFromCart();
  
  useCartSocket({ enabled: true });

  const handleUpdateQuantity = (menuId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(menuId);
      return;
    }
    updateCartMutation.mutate({ menuId, quantity: newQuantity });
  };

  const handleRemove = (menuId) => {
    removeFromCartMutation.mutate(menuId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Add items from the menu</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Your Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
      </h2>
      
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.menuId._id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <img 
              src={item.menuId.image || '/placeholder.png'} 
              alt={item.menuId.name}
              className="w-24 h-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{item.menuId.name}</h4>
              <p className="text-gray-600">₹{item.priceAtAdd} × {item.quantity}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleUpdateQuantity(item.menuId._id, item.quantity - 1)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.menuId._id, item.quantity + 1)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="text-lg font-bold min-w-[100px] text-right">
              ₹{(item.priceAtAdd * item.quantity).toFixed(2)}
            </div>
            
            <button 
              onClick={() => handleRemove(item.menuId._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span>Total:</span>
          <span>₹{cart.totalAmount?.toFixed(2) || '0.00'}</span>
        </div>
        <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
