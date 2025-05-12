// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(react-router-dom)/)', // << forcer transpile
    ],
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules', 'src'],
  };
  