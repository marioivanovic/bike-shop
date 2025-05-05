// src/components/BikeGallery.js
import React from 'react';
import bikes from '../../data/bikes';

import './_bikeCard.css'
export default function BikeCard() {
    return (
        <ul className="bike-cards" role="list">

            {bikes.map((bike, idx) => {
                const src = require(`../../assets/img/${bike.image}`);
                return (
                    <div className="bike-card" key={idx}>
                        <figure>
                            <img src={src} alt={`${bike.brand} ${bike.model}`} />
                            <figcaption>{bike.brand} {bike.model}</figcaption>
                        </figure>
                        <h2>{bike.brand} {bike.model}</h2>
                        <p>{bike.description}</p>
                        <p><strong>{bike.price} €</strong></p>
                    </div>
                );
            })}
        </ul>
    );
}
