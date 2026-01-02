import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardLayout from './dashboard/DashboardLayout';
import GenerateKey from './dashboard/GenerateKey';
import KeysTable from './dashboard/KeysTable';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Default dashboard view */}
            <Route index element={<GenerateKey />} />
            <Route path="keys" element={<KeysTable />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
