// import React from 'react';
// import { useUser } from '../../hooks/useUser';

// const UserDisplay = () => {
//     const { user } = useUser();

//     if (!user) {
//         return <p>Il y a 0 utilisateur...</p>
//     }
//     return (
//         <>
//             <h1>User</h1>
//             <h4>Name: {user.name}</h4>
//             <h4>Email: {user.email}</h4>
//             <h4>Address: {user.address}</h4 >
//         </>

//     )
// }

// export default UserDisplay;

import { useUsers } from '../../hooks/useUsers';

import './_userDisplay.css'

function Users() {
    const { users, loading, error, deleteUser } = useUsers();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;


    const renderProfileImage = (user) => {
        if (user.imageUrl) {
            return (
                <img
                    src={user.imageUrl}
                    alt={`Photo de ${user.name}`}
                    className="profil_img"
                />
            );
        }
        return (
            <div className="profil_noImg">
                {user.name.charAt(0).toUpperCase()}
            </div>
        );
    };

    return (
        <div>
            <h2>Users list</h2>
            {users.map(user => (
                <div key={user.id} className="user_details">
                    {renderProfileImage(user)}

                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <button className="btn" onClick={() => deleteUser(user.id)}>
                        Supprimer
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Users;