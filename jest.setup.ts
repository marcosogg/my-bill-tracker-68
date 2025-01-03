import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Clear all mocks automatically between tests
beforeEach(() => {
  jest.clearAllMocks();
});
