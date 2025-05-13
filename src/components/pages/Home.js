import React from 'react';
import BikeCard from '../bikes/bikeCard';

import './home.css'
function Home() {
    return (
        <>
            <h1>Bikeshop !</h1>
            <h2>Bienvenue sur le site de référence des vélos en France !</h2>
            <BikeCard />
        </>
    )
}

export default Home
