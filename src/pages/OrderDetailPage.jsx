import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../features/orders/orders.hooks';
import { useOrderSocket } from '../features/orders/orders.socket.hook';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  MapPin,
  User,
  Phone,
  Loader2,
  Receipt,
  Coins
} from 'lucide-react';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId);
  useOrderSocket({ enabled: true });

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="text-yellow-500" size={32} />,
      PREPARING: <Package className="text-blue-500" size={32} />,
      OUT_FOR_DELIVERY: <Truck className="text-purple-500" size={32} />,
      DELIVERED: <CheckCircle className="text-green-500" size={32} />,
      CANCELLED: <XCircle className="text-red-500" size={32} />,
    };
    return icons[status] || <Package className="text-gray-500" size={32} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      PREPARING: 'bg-blue-100 text-blue-800 border-blue-300',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-300',
      DELIVERED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-medium">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'PREPARING', label: 'Preparing' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.orderStatus
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-600">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      {/* Status Card */}
      <div
        className={`rounded-lg border-2 p-6 mb-6 ${getStatusColor(order.orderStatus)}`}
      >
        <div className="flex items-center gap-4">
          {getStatusIcon(order.orderStatus)}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {order.orderStatus.replace(/_/g, ' ')}
            </h2>
            <p className="text-sm opacity-80">
              {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {order.orderStatus !== 'CANCELLED' && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index <= currentStepIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index < currentStepIndex ? '✓' : index + 1}
                    </div>
                    <p className="text-xs mt-2 text-center font-medium">
                      {step.label}
                    </p>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 ${
                        index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Order Items</h2>
        </div>

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              {item.itemId?.image && (
                <img
                  src={item.itemId.image}
                  alt={item.itemId.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-lg">
                  {item.itemId?.name || 'Unknown Item'}
                </h3>
                <p className="text-sm text-gray-600">
                  ₹{item.pricePerItem} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₹{(item.pricePerItem * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>
              ₹
              {order.items
                ?.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
          {order.tokenUsed && (
            <div className="flex justify-between text-gray-700 items-center">
              <span className="flex items-center gap-1">
                <Coins size={16} className="text-yellow-600" />
                Tokens Used
              </span>
              <span className="text-yellow-600 font-medium">
                -{order.tokenUsed} tokens
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Paid</span>
            <span className="text-blue-600">
              ₹{order.totalAmount?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Rider Details */}
      {order.riderId && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-blue-600" />
            <h2 className="text-xl font-semibold">Delivery Partner</h2>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{order.riderId.name}</h3>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone size={14} />
                <span className="text-sm">{order.riderId.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
