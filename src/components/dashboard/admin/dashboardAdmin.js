import React from 'react'
import UserDisplay from '../../userDisplay/UserDisplay'
import { useAuth } from '../../../hooks/useAuth';

function DashboardAdmin() {
    const { user } = useAuth();
    return (
        <>
            <h1>
                Bienvenue {user.name} !
                <UserDisplay />
            </h1>
        </>
    )
}

export default DashboardAdmin
