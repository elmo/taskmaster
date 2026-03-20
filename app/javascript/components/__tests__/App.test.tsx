import React from "react";
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import api from "../../utils/api"; // Corrected path to match your previous files

// 1. Mock the API module
vi.mock("../../utils/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("App Component Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.resetModules();
  });


  it("handles adding a new todo", async () => {
    localStorage.setItem("token", "fake-token");
    const newTodo = { id: 3, title: "New Task", completed: false };
    
    (api.get as any).mockResolvedValueOnce({ data: [] });
    (api.post as any).mockResolvedValueOnce({ data: newTodo });

    render(<App />);

    // Wait for App to render the Task list
    const input = await screen.findByPlaceholderText(/What needs to be done?/i);
    
    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/v1/todos", { title: "New Task" });
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("logs out and clears state", async () => {
  localStorage.setItem("token", "fake-token");
  (api.get as any).mockResolvedValueOnce({ data: [] });

  render(<App />);

  const logoutBtn = await screen.findByRole("button", { name: /Logout/i });
  fireEvent.click(logoutBtn);

  // This will pause the test and print the HTML to your terminal
  // Look for "Welcome Back" or "Tasks" in the output!
  screen.debug();

  await waitFor(() => {
    expect(localStorage.getItem("token")).toBeNull();
    // Use queryByText so it doesn't throw an error immediately,
    // allowing us to see the debug output above.
    expect(screen.queryByText(/Login|Welcome/i)).toBeInTheDocument();
  });
});


});
