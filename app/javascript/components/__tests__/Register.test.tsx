import React from 'react'; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Register from "../Register"; 
import api from "../../utils/api";

// Mock the API utility
vi.mock("../../utils/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Register Component", () => {
  const mockOnRegisterSuccess = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the registration form", () => {
    render(<Register onRegisterSuccess={mockOnRegisterSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);
    
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    // Using LabelText ensures your accessibility IDs are working
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it("shows client-side validation error when passwords do not match", async () => {
    render(<Register onRegisterSuccess={mockOnRegisterSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "test@me.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "different123" } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Use { exact: false } to handle the emoji prefix
    expect(await screen.findByText(/Passwords do not match/i, { exact: false })).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("handles successful registration", async () => {
    const mockToken = "new-user-token";
    (api.post as any).mockResolvedValueOnce({ data: { token: mockToken } });

    render(<Register onRegisterSuccess={mockOnRegisterSuccess} onSwitchToRegister={mockOnSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(mockToken);
      expect(mockOnRegisterSuccess).toHaveBeenCalled();
    });
    
    // Check that it wrapped the data in a 'user' key for Rails
    expect(api.post).toHaveBeenCalledWith("/api/v1/users", {
      user: {
        email_address: "new@example.com",
        password: "password123",
        password_confirmation: "password123"
      }
    });
  });

  it("shows loading state while registering", async () => {
  // 1. Mock the API to stay pending
  (api.post as any).mockReturnValue(new Promise(() => {}));

  render(<Register onRegisterSuccess={mockOnRegisterSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

  // 2. Fill fields to satisfy HTML5 validation
  fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "test@me.com" } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

  // 3. Click the Register button
  const submitButton = screen.getByRole("button", { name: /Register/i });
  fireEvent.click(submitButton);

  // 4. FIX: Instead of searching for text globally, check the button we already have
  await waitFor(() => {
    expect(submitButton).toBeDisabled();
    // This looks at the text inside the button specifically
    expect(submitButton.textContent).toContain("Creating Account...");
  });
});

  it("displays server-side error messages (Rails format)", async () => {
    const railsErrors = ["Email has already been taken", "Password is too short"];
    (api.post as any).mockRejectedValueOnce({
      response: { data: { errors: railsErrors } },
    });

    render(<Register onRegisterSuccess={mockOnRegisterSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

    // Fill fields to bypass HTML5 validation
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "taken@me.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // It should join the errors with a comma as per your implementation
    const expectedError = railsErrors.join(", ");
    expect(await screen.findByText(expectedError, { exact: false })).toBeInTheDocument();
  });
});
