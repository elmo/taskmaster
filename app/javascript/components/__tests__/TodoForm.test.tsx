import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TodoForm from "../TodoForm";

describe("TodoForm", () => {
	it("renders the input field", () => {
		// We define a mock function that matches the expected signature (string) => void
		const mockOnAdd = vi.fn<(task: string) => void>();

		render(<TodoForm onAdd={mockOnAdd} />);

		// Type assertion 'as HTMLInputElement' is helpful if you need to check .value later
		const input = screen.getByPlaceholderText(
			/What needs to be done?/i,
		) as HTMLInputElement;

		expect(input).toBeInTheDocument();
	});

	it("calls onAdd with the input value when submitted", () => {
		const mockOnAdd = vi.fn<(task: string) => void>();
		render(<TodoForm onAdd={mockOnAdd} />);

		const input = screen.getByPlaceholderText(
			/What needs to be done?/i,
		) as HTMLInputElement;

		fireEvent.change(input, { target: { value: "Learn TypeScript" } });
		const form = input.closest("form");
		if (form) fireEvent.submit(form);
		expect(mockOnAdd).toHaveBeenCalledWith("Learn TypeScript");
	});
});
