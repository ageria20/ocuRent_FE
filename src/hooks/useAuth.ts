import { useEffect } from 'react';
import { useAppDispatch } from '@/store/store';
import { loginSuccess, logout, initializeAuth } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Verifica il token con il backend
          const response = await fetch('http://localhost:8085/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(loginSuccess({ user: userData.user, token }));
          } else {
            // Token non valido, rimuovi dal localStorage
            localStorage.removeItem('accessToken');
            dispatch(logout());
          }
        } catch (error) {
          console.error('Errore nella verifica del token:', error);
          // Se non riesce a verificare il token, inizializza comunque l'auth
          dispatch(initializeAuth());
        }
      }
    };

    checkAuth();
  }, [dispatch]);
};
