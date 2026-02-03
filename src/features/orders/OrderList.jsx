import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from './orders.hooks';
import { useOrderSocket } from './orders.socket.hook';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';

const OrderList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useOrders({ page, limit: 10, status: statusFilter });
  useOrderSocket({ enabled: true });

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="text-yellow-500" size={20} />,
      PREPARING: <Package className="text-blue-500" size={20} />,
      OUT_FOR_DELIVERY: <Truck className="text-purple-500" size={20} />,
      DELIVERED: <CheckCircle className="text-green-500" size={20} />,
      CANCELLED: <XCircle className="text-red-500" size={20} />,
    };
    return icons[status] || <Package className="text-gray-500" size={20} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PREPARING: 'bg-blue-100 text-blue-800 border-blue-200',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const orders = data?.items || [];
  const meta = data?.meta || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Orders</h2>
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="PREPARING">Preparing</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-medium">No orders found</p>
          <p className="text-gray-500 mt-2">
            {statusFilter ? 'Try changing the filter' : 'Start ordering delicious food!'}
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.orderStatus)}
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {formatStatus(order.orderStatus)}
                    </span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">
                        {item.itemId?.name || 'Unknown Item'} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.pricePerItem * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    {order.tokenUsed && (
                      <p className="text-xs text-gray-500">
                        {order.tokenUsed} tokens used
                      </p>
                    )}
                  </div>

                  {order.riderId && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Delivery by</p>
                      <p className="font-medium text-sm">{order.riderId.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for Active Orders */}
              {['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.orderStatus) && (
                <div className="bg-gray-50 px-6 py-3 border-t">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className={order.orderStatus === 'PENDING' ? 'font-semibold' : ''}>
                      Pending
                    </span>
                    <span className={order.orderStatus === 'PREPARING' ? 'font-semibold' : ''}>
                      Preparing
                    </span>
                    <span className={order.orderStatus === 'OUT_FOR_DELIVERY' ? 'font-semibold' : ''}>
                      Delivering
                    </span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          order.orderStatus === 'PENDING'
                            ? '25%'
                            : order.orderStatus === 'PREPARING'
                            ? '50%'
                            : order.orderStatus === 'OUT_FOR_DELIVERY'
                            ? '75%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {meta.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            disabled={page === meta.pages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
