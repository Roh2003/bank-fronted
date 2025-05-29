import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './layout.jsx';
import SignupPage from './components/signup.jsx';
import SigninPageB from './components/bankerlogin.jsx';
import CustomerPage from './components/customerPage.jsx';
import BankerDashboard from './components/banker.jsx';
import TransactionModal from './components/transactionModel.jsx';
import SigninPage from './components/signin.jsx';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/signin" />;
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signinb" element={<SigninPageB />} />
      <Route path="/admin" element={<BankerDashboard />} />

      {/* Shared Layout with Header/Footer */}
      <Route
        path="/layout"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="customer" element={<CustomerPage />} />
        <Route path="transaction" element={<TransactionModal />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
