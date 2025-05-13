import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const { updateUser, loading, error } = useUsers();
    
    const userId = id || (currentUser ? currentUser.id : null);


    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        imageUrl: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                if (id && id !== currentUser?.id) {
                    const userData = await useUsers.fetchUserById(id);
                    setFormData({
                        name: userData.name || '',
                        email: userData.email || '',
                        imageUrl: userData.imageUrl || ''
                    });
                } 
                else if (currentUser) {
                    setFormData({
                        name: currentUser.name || '',
                        email: currentUser.email || '',
                        imageUrl: currentUser.imageUrl || ''
                    });
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données user:", err);
            }
        };

        if (userId) {
            loadUserData();
        }
    }, [userId, currentUser, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userId, formData);
            setSuccessMessage('Profil mis à jour avec succès !');
            setIsEditing(false);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Erreur de mise à jour du profil:', err);
        }
    };

    if (!userId) {
        return (
            <div>
                <div>
                    <h2>Profil utilisateur</h2>
                    <p>Veuillez vous connecter pour voir votre profil.</p>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div>
                <h2>Profil utilisateur</h2>
                
                {successMessage && (
                    <div>
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div>
                        {error}
                    </div>
                )}

                {!isEditing ? (
                    <>
                        <div>
                            {currentUser.imageUrl && (
                                <div>
                                    <img 
                                        src={currentUser.imageUrl} 
                                        alt="Photo de profil" 
                                    />
                                </div>
                            )}
                            
                            <div>
                                <p> {currentUser.name}</p>
                                <p> {currentUser.email}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier mon profil
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Sauvegarde...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;