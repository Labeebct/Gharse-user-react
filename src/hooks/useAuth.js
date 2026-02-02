import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setToken(accessToken);
    setIsAuthenticated(!!accessToken);
  }, []);

  return {
    token,
    isAuthenticated,
  };
};
