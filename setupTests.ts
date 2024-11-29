import '@testing-library/jest-dom/vitest';
import { vi, describe, expect, it } from 'vitest';

// Silence css not parsed error for tests
const originalError = console.error;

console.error = (message: string, ...args: unknown[]) => {
  if (message.includes('Could not parse CSS stylesheet')) {
    return;
  }
  originalError(message, ...args);
};
// Mock scrollTo
Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
  value: vi.fn(), 
  writable: true,
});

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})