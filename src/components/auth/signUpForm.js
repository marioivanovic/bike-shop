import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import './_signUpForm.css'

function RegisterForm() {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [localError, setLocalError] = useState('');
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [captchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef();
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordStrong = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(password);

    useEffect(() => {
        nameRef.current?.focus();
        emailRef.current?.focus();
        passwordRef.current?.focus();
    }, []);

    const handleCaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setLocalError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLocalError('');

        if (!isValidEmail(formData.email)) {
            setLocalError('❌  Email invalide');
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setLocalError('❌  Mot de passe trop faible, il faut :12 caractères min, majuscule, minuscule, chiffre, symbole');
            return;
        }

        if (!formData.firstName || !formData.lastName) {
            setLocalError('❌ Tous les champs sont obligatoires');
            return;
        }
        if (!captchaToken) {
            alert('❌ Veuillez valider le CAPTCHA');
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);

            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }
            formDataToSend.append('captcha', captchaToken);

            await register(formDataToSend);
            navigate('/homepage');
        } catch (err) {
            console.error('Erreur d\'inscription:', err);
        }
    };

    return (
        <>
            <div className='register-container'>
                <h2>Inscription</h2>
                {(error || localError) && (
                    <div className="error-message" role="alert" aria-live="assertive">
                        {localError || error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Informations personnelles</legend>
                        <div className='input-container'>

                            <label htmlFor='firstName'>Prénom : </label>
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                placeholder='Entrez votre prénom...'
                                value={formData.firstName}
                                onChange={handleChange}
                                data-testid="firstName"
                                required
                            />
                        </div>

                        <div className='input-container'>
                            <label htmlFor='lastName'>Nom : </label>
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder='Entrez votre nom...'
                                value={formData.lastName}
                                onChange={handleChange}
                                data-testid="lastName"
                                required
                            />
                        </div>

                        <div className='input-container'>
                            <label htmlFor='email'>Email : </label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                name="email"
                                placeholder='Entrez votre email...'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Sécurité</legend>
                        <div className='input-container'>
                            <label htmlFor='password'>Mot de passe : </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                type="password"
                                name="password"
                                placeholder='entrez un mot de passe'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Photo de profil : </legend>
                        <div className='input-container'>
                            <label htmlFor='profileImage'>Votre photo de profil</label>
                            <input
                                id="profileImage"
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewImage && (
                                <div>
                                    <p>Aperçu :</p>
                                    <img
                                        src={previewImage}
                                        alt="Aperçu de la photo de profil"
                                        className="preview_img"
                                    />
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfI0ikrAAAAANmlLJvc5bgrh3OSgqL2VSGUt10W'}
                        onChange={(token) => setRecaptchaToken(token)}
                    />
                    <button
                        className='submit-btn'
                        type="submit"
                        disabled={loading || !captchaToken}
                        aria-busy={loading}
                    >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default RegisterForm;