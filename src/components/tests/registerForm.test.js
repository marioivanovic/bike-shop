import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../auth/signUpForm';
import { BrowserRouter } from 'react-router';

jest.mock('react-router-dom');

//On va mock l'auth hook
jest.mock('../../hooks/useAuth.js', () => ({
    useAuth: () => ({
        register: jest.fn(() => Promise.resolve()),
        loading: false,
        error: null,
    }),
}));

//On mock ici le reCAPTCHA
jest.mock('react-google-recaptcha', () => () => (
    <div data-testid="recaptcha">[Mock CAPTCHA]</div>
));

describe('Test fonctionnel du RegisterForm', () => {
    test('L’utilisateur peut remplir et soumettre le formulaire', async () => {
        render(
            <BrowserRouter>
                <RegisterForm />
            </BrowserRouter>
        );

        // Ici on va remplir tous les champs
        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Durand' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@mail.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'SuperP@ssword123' } });

        // On soumet notre formulaire
        fireEvent.click(screen.getByText(/s'inscrire/i));

        //On va vérifier qu’aucune erreur n’est affichée et que ça a marché
        await waitFor(() => {
            expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/mot de passe trop faible/i)).not.toBeInTheDocument();
            expect(useAuth().register).toHaveBeenCalled();
        });
    });
});