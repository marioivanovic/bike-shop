import { useState, useContext, createContext } from 'react';
import { authAPI } from '../api/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.register(formData);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur d\'inscription');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const updateUserState = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ 
            user,
            setUser: updateUserState,
            loading, 
            error, 
            register, 
            login, 
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};