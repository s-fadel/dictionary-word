import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({ word: 'test', phonetic: 'test' }),
  ok: true,
} as Response);


test('renders App component', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hello/i);
  expect(headerElement).toBeInTheDocument();
});

/* test('handles search success', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ word: 'test', phonetic: 'test' }),
    ok: true,
  } as Response);

  const useStateMock = jest.spyOn(React, 'useState');

  // Set an initial state for dictionaryWord
  const initialDictionaryWord = [{ word: 'test', phonetic: 'test' }];
  
  // Simulate setting dictionaryWord to the desired value
  useStateMock.mockReturnValueOnce([initialDictionaryWord, jest.fn()]);

  render(<App />);

  const searchInput = screen.getByPlaceholderText('Search for word...');
  const searchButton = screen.getByTestId('search-btn');

  fireEvent.change(searchInput, { target: { value: 'test' } });
  fireEvent.click(searchButton);

  await waitFor(() => {
    const resultElement = screen.queryByTestId('result');
    const errorMessageElement = screen.queryByTestId('error-message');

    expect(errorMessageElement).not.toBeInTheDocument();
    expect(resultElement).toBeInTheDocument();
  });
}); */

test('handles search error', async () => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: async () => ({ message: 'Error message' }),
      ok: false,
    } as Response)
  );

  render(<App />);

  // Hitta sök-input och knappen
  const searchInput = screen.getByPlaceholderText('Search for word...');
  const searchButton = screen.getByTestId('search-btn');

  // Simulera användarens inmatning och klick på sökknappen
  fireEvent.change(searchInput, { target: { value: 'testttttty' } });
  fireEvent.click(searchButton);

  await waitFor(() => {
    const resultElement = screen.queryByTestId('result');
    const errorElement = screen.queryByTestId('error-message');
      expect(resultElement).not.toBeInTheDocument();
      expect(errorElement).toBeInTheDocument();
  });


  // Kontrollera att fetch-funktionen har anropats med rätt URL
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.dictionaryapi.dev/api/v2/entries/en/testttttty'
  );
});