import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock contexte authentification
jest.mock('./hooks/useAuth', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  })
}));

//Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ path, element }) => <div data-testid={`route-${path}`}>{element}</div>,
  Link: ({ children, to }) => <a href={to} data-testid={`link-${to}`}>{children}</a>,
  Navigate: () => <div data-testid="navigate"></div>,
  useNavigate: () => jest.fn()
}));

// Mock composants de page
jest.mock('./components/pages/Home.js', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('./components/auth/loginForm.js', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('./components/auth/signUpForm.js', () => () => <div data-testid="register-page">Register Page</div>);

// 4. Test
test('App renders without crashing', () => {
  render(<App />);
  
  // Vérifiez que les éléments de base sont présents
  expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  expect(screen.getByTestId('router')).toBeInTheDocument();
  
});