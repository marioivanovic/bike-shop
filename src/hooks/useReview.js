import { useState, useEffect, useCallback } from 'react';
import { reviewsAPI } from '../api/config';

export const useReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getReviews = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reviewsAPI.getAllReviews();
            setReviews(response.data);
            setError(null);
        } catch (err) {
            setError("Erreur au chargement des avis");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createReview = async (reviewData) => {
        setLoading(true);
        try {
            const response = await reviewsAPI.createReview(reviewData);
            setReviews(current => [response.data, ...current]);
            setError(null);
            return response.data;
        } catch (err) {
            setError("Erreur ajout avis");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReviews();
    }, [getReviews]);

    return {
        reviews,
        loading,
        error,
        getReviews,
        createReview
    };
};
