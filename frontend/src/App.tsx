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
import { PlacesAdmin } from './pages/admin/PlacesAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import { Layout } from './components/Layout';

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
              path="/"
              element={<Navigate to="/map" />}
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MapView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ListView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/places"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlacesAdmin />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EventsAdmin />
                  </Layout>
                </ProtectedRoute>
              }
            />
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
