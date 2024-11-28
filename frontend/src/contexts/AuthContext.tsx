import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  darkMode: boolean;
  profilePicture?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const validateToken = async (currentToken: string) => {
    try {
      console.log('Validating token:', currentToken.substring(0, 10) + '...');
      const response = await fetch(`${API_ENDPOINTS.VALIDATE_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        console.log('Token validation successful:', data);
        setUser(data.user);
        return true;
      } else {
        console.error('Token validation failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        if (token) {
          console.log('Found token in localStorage, validating...');
          const isValid = await validateToken(token);
          if (!isValid) {
            console.log('Token validation failed during initialization');
            logout();
          } else {
            console.log('Token validation successful during initialization');
          }
        } else {
          console.log('No token found in localStorage');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    try {
      console.log('Starting login process...');
      if (!newToken) {
        throw new Error('No token provided');
      }

      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      console.log('Validating new token...');
      const isValid = await validateToken(newToken);
      
      if (isValid) {
        console.log('Login successful, navigating to map...');
        navigate('/map');
      } else {
        console.error('Login failed: token validation failed');
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      logout();
      throw error; // Re-throw the error to be handled by the login component
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedUser: User) => {
    console.log('Updating user:', updatedUser);
    setUser(updatedUser);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
