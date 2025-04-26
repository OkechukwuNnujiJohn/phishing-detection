import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../HomePage';

beforeAll(() => {
  window.alert = jest.fn();
});

test('renders Check URL button', async () => {
  await act(async () => {
    render(<HomePage />);
  });
  const buttonElement = screen.getByText(/Check URL/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders input field', async () => {
  await act(async () => {
    render(<HomePage />);
  });
  const inputElement = screen.getByPlaceholderText(/Enter URL/i);
  expect(inputElement).toBeInTheDocument();
});

