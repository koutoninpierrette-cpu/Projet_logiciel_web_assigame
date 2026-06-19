/**
 * Composant de protection des routes selon le rôle.
 * Usage : <ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>
 */
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface Props {
  children: ReactNode;
  roles?: Role[]; // optionnel : restreint à certains rôles
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Non connecté : redirection vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Connecté mais rôle interdit : retour à l'accueil
  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
