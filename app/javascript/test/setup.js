import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Adds helpful DOM matchers like .toBeInTheDocument()
expect.extend(matchers);

// Automatically cleans up the DOM after every test
afterEach(() => {
  cleanup();
});
