import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi, describe } from 'vitest';
import  TodoList from '../TodoList'; // Adjust path as needed

// Define a type for our Todo to keep TypeScript happy
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

describe('TodoList Components', () => {
  const mockTodos: Todo[] = [
    { id: 1, title: 'Finish Vitest setup', completed: false },
    { id: 2, title: 'Write React tests', completed: true },
  ];

  const mockOnToggle = vi.fn<(todo: Todo) => void>();

  it('renders the correct number of todo items', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} />);
    
    // Check for both titles
    expect(screen.getByText(/Finish Vitest setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Write React tests/i)).toBeInTheDocument();
    
    // Ensure we have two list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  it('calls onToggle with the specific todo object when a checkbox is clicked', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} />);
    
    // Find the checkboxes (Role is 'checkbox')
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    
    // Click the first one
    fireEvent.click(checkboxes[0]);

    // Verify the mock was called with the first todo object
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('applies line-through style to completed items', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} />);
    
    const completedText = screen.getByText(/Write React tests/i);
    
    // Check for the Tailwind class used in your component
    expect(completedText).toHaveClass('line-through');
    expect(completedText).toHaveClass('text-gray-400');
  });

  it('does not apply line-through to active items', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} />);
    
    const activeText = screen.getByText(/Finish Vitest setup/i);
    
    expect(activeText).not.toHaveClass('line-through');
    expect(activeText).toHaveClass('text-gray-700');
  });
});
