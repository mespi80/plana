import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CssBaseline, Box } from '@mui/material';
import { Login } from './pages/Login';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import Search from './pages/Search';
import { Settings } from './pages/Settings';
import BottomNav from './components/BottomNav';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const AppContent = () => {
  const location = useLocation();
  const showBottomNav = location.pathname !== '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <Box sx={{ pb: showBottomNav ? 7 : 0 }}>
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
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
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
            <Route path="/" element={<Navigate to="/map" replace />} />
          </Routes>
          {showBottomNav && <BottomNav />}
        </Box>
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
