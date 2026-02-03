import { useNavigate } from 'react-router-dom';
import { useCheckout, usePlaceOrder } from '../features/orders/orders.hooks';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  Loader2,
  Receipt,
  Coins
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { data: checkout, isLoading, error } = useCheckout();
  const placeOrderMutation = usePlaceOrder();

  const handlePlaceOrder = () => {
    placeOrderMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load checkout</p>
          <p className="text-red-500 text-sm mb-4">
            {error?.response?.data?.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const { items = [], pricing, address } = checkout || {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={20} className="text-blue-600" />
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  {item.menuId?.image && (
                    <img
                      src={item.menuId.image}
                      alt={item.menuId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.menuId?.name || 'Unknown Item'}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.priceAtAdd} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">
                    ₹{(item.priceAtAdd * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>
            
            {address ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-1">{address.label || 'Home'}</p>
                <p className="text-gray-700">{address.street}</p>
                <p className="text-gray-700">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                {address.landmark && (
                  <p className="text-sm text-gray-600 mt-1">
                    Landmark: {address.landmark}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No address found</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins size={20} className="text-blue-600" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Coins size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Token Payment</p>
                  <p className="text-sm text-gray-600">
                    Pay using your token balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={20} className="text-blue-600" />
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{pricing?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{pricing?.deliveryFee?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{pricing?.tax?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">
                  ₹{pricing?.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </div>

              {pricing?.totalAmount && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 font-medium flex items-center gap-1">
                    <Coins size={14} />
                    <span>
                      {Math.round((pricing?.totalAmount || 0) * 100)} tokens will be deducted
                    </span>
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending || !items.length}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Place Order</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
