import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getMe, createChild as createChildApi } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('techmateai_token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('techmateai_token', authToken);
    localStorage.setItem('techmateai_user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techmateai_token');
    localStorage.removeItem('techmateai_user');
  };

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('techmateai_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMe();
      const payload = response.data.data || response.data;
      setUser(payload.user || payload);
      setToken(storedToken);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password });
      const payload = response.data.data || response.data;
      const { user: userData, token: authToken } = payload;
      saveAuth(userData, authToken);
      toast.success('¡Bienvenido de vuelta! 🎉');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (data) => {
    try {
      const response = await registerApi(data);
      const payload = response.data.data || response.data;
      const { user: userData, token: authToken } = payload;
      saveAuth(userData, authToken);
      toast.success('¡Cuenta creada exitosamente! 🚀');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearAuth();
    toast.success('¡Hasta pronto! 👋');
  };

  const createChild = async (data) => {
    try {
      const response = await createChildApi(data);
      toast.success('¡Perfil de niño creado! 🌟');
      return { success: true, child: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear perfil';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    createChild,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
