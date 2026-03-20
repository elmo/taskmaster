import React from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import TodoForm from '../TodoForm';

it('renders the input field', () => {
  render(<TodoForm onAdd={() => {}} />);
  const input = screen.getByPlaceholderText(/What needs to be done?/i);
  expect(input).toBeInTheDocument();
});
