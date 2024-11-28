import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CssBaseline } from '@mui/material';
import { Login } from './pages/Login';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings } from './pages/Settings';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <div className="App">
          {showNavbar && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <ListView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
