import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/server.ts', // Replace with the entry point of your application
      output: {
        format: 'cjs', // CommonJS is better for Node.js applications
        manualChunks: undefined, // Disable code splitting
        entryFileNames: '[name].js', // Avoid hashed file names
      },
      external: [
        // List libraries to exclude from bundling
        'express',
        '@prisma/client',
        'dotenv',
        'fs',
        'path',
        'util', // Add all Node.js native modules
      ],
    },
    minify: false, // Avoid aggressive minification for server-side code
    sourcemap: false, // Disable source maps
  },
});
