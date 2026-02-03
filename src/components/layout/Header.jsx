import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useCart } from '../../features/cart/cart.hooks';
import { useSocket } from '../../contexts/SocketContext';

const Header = () => {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const { connectionStatus } = useSocket();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cartItemsCount = cart?.items?.length || 0;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FoodCart</h1>
          
          <nav className="flex items-center gap-6">
            <Link to="/menu" className="text-gray-700 hover:text-blue-600">
              Menu
            </Link>
            
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
            
            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {connectionStatus === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />}
            </div>
            
            <span className="text-gray-600">{user.name}</span>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            >
              <LogOut size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
