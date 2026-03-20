import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest with useful DOM matchers like .toBeInTheDocument()
expect.extend(matchers);

// Runs a cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});
