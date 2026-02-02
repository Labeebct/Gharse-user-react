import { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  }, []);

  const showSuccess = useCallback((message) => showAlert(message, 'success'), [showAlert]);
  const showError = useCallback((message) => showAlert(message, 'error'), [showAlert]);
  const showWarning = useCallback((message) => showAlert(message, 'warning'), [showAlert]);
  const showInfo = useCallback((message) => showAlert(message, 'info'), [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`px-4 py-3 rounded shadow-lg ${
              alert.type === 'success' ? 'bg-green-500 text-white' :
              alert.type === 'error' ? 'bg-red-500 text-white' :
              alert.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};
