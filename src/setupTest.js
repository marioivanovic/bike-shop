import React from 'react';

// Mock axios globalement
jest.mock('axios', () => ({
  default: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} }))
}));

// Créer une version mockée du react-google-recaptcha, là où React est dispo
jest.mock('react-google-recaptcha', () => {
  const MockedRecaptcha = (props) => (
    <div data-testid="recaptcha">[Mock CAPTCHA]</div>
  );
  return MockedRecaptcha;
});