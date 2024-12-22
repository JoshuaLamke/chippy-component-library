import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({
    root: "."
  })],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    include: ['**/*.test.{ts,tsx,js,jsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage', 
      include: ['src/components/ui/lib/**/*.{ts,tsx,js,jsx}'],
      thresholds: {
        lines: 100,
        functions: 100, 
        branches: 100, 
        statements: 100,
      }
    },

  },
  resolve: {
    alias: {
      // Mock all CSS imports
      '\\.(css|less|scss|sass)$': './__mocks__/styleMock.js',
      // Mock all image imports
      '\\.(jpg|jpeg|png|gif|webp|svg)$': './__mocks__/fileMock.js',
      // Mock all font imports
      '\\.(woff|woff2|eot|ttf|otf)$': './__mocks__/fileMock.js',
      // Mock other static assets like videos
      '\\.(mp4|webm|ogg)$': './__mocks__/fileMock.js',
    },
  },
})
