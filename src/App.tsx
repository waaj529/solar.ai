import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/services/AuthContext';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import Home from './pages/Home';
import Engineer from './pages/Engineer';
import Empower from './pages/Empower';
import Envision from './pages/Envision';
import Evolve from './pages/Evolve';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

/**
 * The root component defines the routing with authentication protection.
 * All pages except signin/signup require authentication.
 * Users are redirected to signin when accessing protected routes without authentication.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative overflow-x-hidden min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/engineer" element={
              <ProtectedRoute>
                <Engineer />
              </ProtectedRoute>
            } />
            <Route path="/empower" element={
              <ProtectedRoute>
                <Empower />
              </ProtectedRoute>
            } />
            <Route path="/envision" element={
              <ProtectedRoute>
                <Envision />
              </ProtectedRoute>
            } />
            <Route path="/evolve" element={
              <ProtectedRoute>
                <Evolve />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch-all redirect to signin for unknown routes */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;