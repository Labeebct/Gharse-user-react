import Header from '../components/layout/Header';
import MenuList from '../features/menu/MenuList';

const MenuPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MenuList />
      </main>
    </div>
  );
};

export default MenuPage;
