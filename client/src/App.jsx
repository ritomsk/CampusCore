import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentPage from './pages/StudentPage';
import ProfessorPage from './pages/ProfessorPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      
      {/* Protected Dashboards */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="Student">
            <StudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/*"
        element={
          <ProtectedRoute role="Professor">
            <ProfessorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="Admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
