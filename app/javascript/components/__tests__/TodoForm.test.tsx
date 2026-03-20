import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi, describe } from 'vitest';
import TodoForm from '../TodoForm';

describe('TodoForm', () => {
  it('renders the input field', () => {
    // We define a mock function that matches the expected signature (string) => void
    const mockOnAdd = vi.fn<(task: string) => void>();
    
    render(<TodoForm onAdd={mockOnAdd} />);
    
    // Type assertion 'as HTMLInputElement' is helpful if you need to check .value later
    const input = screen.getByPlaceholderText(/What needs to be done?/i) as HTMLInputElement;
    
    expect(input).toBeInTheDocument();
  });

  it('calls onAdd with the input value when submitted', () => {
    const mockOnAdd = vi.fn<(task: string) => void>();
    render(<TodoForm onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText(/What needs to be done?/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });
    fireEvent.submit(input.closest('form')!); // The '!' tells TS the form definitely exists

    expect(mockOnAdd).toHaveBeenCalledWith('Learn TypeScript');
  });
});
