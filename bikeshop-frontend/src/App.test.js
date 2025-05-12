import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('rend un élément de la page d’accueil', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const titleElement = screen.getByText(/accueil/i);
  expect(titleElement).toBeInTheDocument();
});
