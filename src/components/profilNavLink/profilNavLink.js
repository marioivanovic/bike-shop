import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
function ProfilNavLink() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/homepage'); // Redirection vers la page d'accueil après déconnexion
    };

    if (!isAuthenticated) {
        return (
            <div>
                <Link to="/auth/login">Connexion</Link>
                <Link to="/auth/register">Inscription</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to={`/user/${user.id}`}>Mon Profil</Link>
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
};

export default ProfilNavLink
