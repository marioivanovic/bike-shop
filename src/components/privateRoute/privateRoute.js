import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Composant pour protéger les routes qui nécessitent une authentification
// Si utilisateur connecté, on affiche le composant enfant
// Sinon, utilisateur redirigé vers la page de connexion
const PrivateRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
    console.log('PrivateRoute - user:', user);
    console.log('PrivateRoute - requiredRole:', requiredRole);

    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated || !user) {
        console.log('PrivateRoute - Redirection vers login (non authentifié)');
        return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }

    // On vérifie que l'user à un rôle si le rôle est nécessaire.
    if (requiredRole && user.role !== requiredRole) {
        console.log(`PrivateRoute - Accès refusé (rôle attendu: ${requiredRole}, rôle actuel: ${user.role})`);
        return <Navigate to="/auth/login" replace />;
    }
    console.log('PrivateRoute - Accès autorisé');
    return children;
};

export default PrivateRoute;
