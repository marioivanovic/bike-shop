import React from 'react';
import { useReview } from '../../hooks/useReview';
import ReviewsForm from '../reviews/reviewsForm'

import './reviewsList.css'

export default function ReviewList() {
    const { reviews, loading, error } = useReview();

    return (
        <>
            <ReviewsForm />
            <h2>Avis des visiteurs</h2>

            {loading && <p>Chargement des avis...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && reviews.length === 0 && (
                <p>Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
            )}
            <div className='reviews-container'>
                {reviews.map((review) => (

                    <article className='review-card' key={review.id}>
                        <p>{review.name} {review.rating}/5</p>
                        <p>{review.description}</p>
                    </article>


                ))}
            </div>
        </>
    );
}