/**
 * Routeur principal de l'application.
 * Routes publiques : / , /produits , /produits/:id , /login , /register
 * Routes vendeur  : /vendeur (CRUD ses annonces)
 * Routes admin    : /admin/*
 */
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import VendorProducts from './pages/dashboard/VendorProducts';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminCategories from './pages/dashboard/AdminCategories';
import AdminTypeUtilisateur from './pages/dashboard/AdminTypeUtilisateur';
import AdminProducts from './pages/dashboard/AdminProducts';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ----- Routes publiques ----- */}
        <Route index element={<Home />} />
        <Route path="produits" element={<ProductList />} />
        <Route path="produits/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* ----- Espace Vendeur ----- */}
        <Route
          path="vendeur"
          element={
            <ProtectedRoute roles={['VENDEUR', 'ADMIN']}>
              <DashboardLayout title="Espace vendeur" />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorProducts />} />
        </Route>

        {/* ----- Espace Admin ----- */}
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <DashboardLayout title="Administration" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminProducts />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="types-utilisateur" element={<AdminTypeUtilisateur />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
