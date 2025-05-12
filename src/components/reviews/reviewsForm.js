import React, { useState } from 'react';
import { useReview } from '../../hooks/useReview'
import { useNavigate } from 'react-router-dom';

import './reviewForm.css';
export default function ReviewForm() {
  const navigate = useNavigate();
  const { createReview, loading, error } = useReview();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(formData);
      setMessage('Merci pour votre avis !');
      navigate('/homepage');
    } catch (err) {
      console.error('Erreur d\'envoi de votre avis:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  return (
    <form className='review-form' onSubmit={handleSubmit}>
      <label htmlFor="name">Name :</label>
      <input
        name="name"
        placeholder="Nom"
        value={formData.name}
        onChange={handleChange}
      />
      <label htmlFor="rating">Note :</label>
      <input
        name="rating"
        type="number"
        min="0"
        max="5"
        value={formData.rating}
        onChange={handleChange}
      />
      <label htmlFor="description">Votre message :</label>
      <textarea
        name="description"
        placeholder="Commentaire"
        value={formData.description}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Envoi en cours…' : 'Poster mon avis'}
      </button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}