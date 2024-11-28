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
      console.log('Validating token...');
      const response = await fetch(`${API_ENDPOINTS.VALIDATE_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token validation successful:', data);
        setUser(data.user);
        return true;
      } else {
        console.error('Token validation failed');
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        const isValid = await validateToken(token);
        if (!isValid) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    console.log('Logging in with token...');
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const isValid = await validateToken(newToken);
    if (isValid) {
      console.log('Login successful, navigating to map...');
      navigate('/map');
    } else {
      console.error('Login failed: token validation failed');
      logout();
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
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {!isLoading && children}
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
