import { Plus } from 'lucide-react';
import { useMenuItems } from './menu.hooks';
import { useAddToCart } from '../cart/cart.hooks';

const MenuList = () => {
  const { data: menuItems, isLoading } = useMenuItems();  


  const addToCartMutation = useAddToCart();

  const handleAddToCart = (menuId) => {
    addToCartMutation.mutate({ menuId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems?.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <img 
              src={item.image || '/placeholder.png'} 
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                
                <button
                  onClick={() => handleAddToCart(item._id)}
                  disabled={!item.isAvailable || addToCartMutation.isPending}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              
              {!item.isAvailable && (
                <p className="text-red-500 text-sm mt-2">Currently unavailable</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
