import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../../components/Login";
import api from "../../utils/api";

// Mock the axios instance
vi.mock("../../utils/api", () => ({
	default: {
		post: vi.fn(),
	},
}));

describe("Login Component", () => {
	const mockOnLoginSuccess = vi.fn();
	const mockOnSwitchToRegister = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	it("renders the login form correctly", () => {
		render(
			<Login
				onLoginSuccess={mockOnLoginSuccess}
				onSwitchToRegister={mockOnSwitchToRegister}
			/>,
		);

		expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
	});

	it("handles successful login", async () => {
		const mockToken = "fake-jwt-token";
		vi.mocked(api.post).mockResolvedValueOnce({ data: { token: mockToken } });

		render(
			<Login
				onLoginSuccess={mockOnLoginSuccess}
				onSwitchToRegister={mockOnSwitchToRegister}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

		await waitFor(() => {
			expect(localStorage.getItem("token")).toBe(mockToken);
			expect(mockOnLoginSuccess).toHaveBeenCalled();
		});
	});
	// In Login.test.tsx
	it("displays error message on failed login", async () => {
		const errorMessage = "Invalid email or password";
		vi.mocked(api.post).mockRejectedValueOnce({
			response: { data: { error: errorMessage } },
		});

		render(
			<Login
				onLoginSuccess={mockOnLoginSuccess}
				onSwitchToRegister={mockOnSwitchToRegister}
			/>,
		);

		// 1. Fill fields to pass HTML validation
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: "wrongpass" },
		});

		// 2. Trigger click
		fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

		// 3. FIX: Use exact: false to ignore the emoji prefix
		const alert = await screen.findByText(errorMessage, { exact: false });

		expect(alert).toBeInTheDocument();
		expect(mockOnLoginSuccess).not.toHaveBeenCalled();
	});

	it("shows loading state while submitting", async () => {
		// 1. Mock the API to stay pending (never resolves)
		vi.mocked(api.post).mockReturnValue(new Promise(() => {}));

		render(
			<Login
				onLoginSuccess={mockOnLoginSuccess}
				onSwitchToRegister={mockOnSwitchToRegister}
			/>,
		);

		// 2. FILL THE FIELDS (Required to pass HTML validation)
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: "password123" },
		});

		// 3. Click the button
		const submitButton = screen.getByRole("button", { name: /Sign In/i });
		fireEvent.click(submitButton);

		// 4. Use waitFor to give the state time to update
		await waitFor(() => {
			expect(submitButton).toBeDisabled();
			expect(submitButton.textContent).toContain("Signing in...");
		});
	});
});
