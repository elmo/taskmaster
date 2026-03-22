import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Extends Vitest with useful DOM matchers like .toBeInTheDocument()
expect.extend(matchers);

// Runs a cleanup after each test to prevent memory leaks
afterEach(() => {
	cleanup();
});
