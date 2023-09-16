import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test('renders App component', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hello/i);
  expect(headerElement).toBeInTheDocument();
});

test('handles search success', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ([{ word: 'test', phonetic: 'test', phonetics: [{ audio: 'audio-sound'}], meanings: [] }]),
    ok: true,
  } as Response);

  render(<App />);

  const searchInput = screen.getByPlaceholderText('Search for word...');
  const searchButton = screen.getByTestId('search-btn');

  act(() => {
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);
  });

  await waitFor(async () => {
    const resultElement = screen.queryByTestId('result');
    expect(resultElement).toBeInTheDocument();
    expect(screen.queryByTestId('audio-sound-0')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.dictionaryapi.dev/api/v2/entries/en/test'
  );
});

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

test('should show error message and do not call api when user search with empty word', async () => {
  render(<App />);

  // Hitta sök-input och knappen
  const searchInput = screen.getByPlaceholderText('Search for word...');
  const searchButton = screen.getByTestId('search-btn');

  // Simulera användarens inmatning och klick på sökknappen
  fireEvent.change(searchInput, { target: { value: '' } });
  fireEvent.click(searchButton);

  await waitFor(() => {
    const resultElement = screen.queryByTestId('result');
    const errorElement = screen.queryByTestId('error-message');
      expect(resultElement).not.toBeInTheDocument();
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent("The search field cannot be left empty. Please enter a word.")
  });


  // Kontrollera att fetch-funktionen har anropats med rätt URL
  expect(global.fetch).not.toHaveBeenCalledWith(
    'https://api.dictionaryapi.dev/api/v2/entries/en/'
  );
});