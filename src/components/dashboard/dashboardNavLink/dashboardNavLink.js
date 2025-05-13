import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const DashboardNavLink = () => {
  const { user, isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas connecté, on affiche rien 
  if (!isAuthenticated) {
    return null;
  }

  // Lien en fonction du rôle
  const dashboardLink = user.role === 'admin' 
    ? '/dashboard/admin'
    : '/dashboard';
  
  const dashboardLabel = user.role === 'admin'
    ? 'Dashboard Admin'
    : 'Mon Dashboard';

  return (
    <Link to={dashboardLink}>
      {dashboardLabel}
    </Link>
  );
};

export default DashboardNavLink;