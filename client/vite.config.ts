import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize React for production
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  server: {
    port: 5173
  },
  build: {
    // Optimize build output
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: true,
      format: {
        comments: false, // Remove comments
      },
    } as any,
    cssCodeSplit: true,
    cssMinify: true,
    sourcemap: false, // Disable sourcemaps for smaller builds
    rollupOptions: {
      output: {
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks(id) {
          // More granular chunking for better caching
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Socket.IO - separate chunk as it's large
            if (id.includes('socket.io')) {
              return 'socket-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // React Icons - separate chunk (can be large)
            if (id.includes('react-icons')) {
              return 'react-icons-vendor';
            }
            // Axios and HTTP clients
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Other utilities
            if (id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    // Optimize asset inlining threshold
    assetsInlineLimit: 4096, // 4kb
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'socket.io-client',
    ],
    exclude: ['framer-motion'], // Let it be lazy loaded
  },
});
