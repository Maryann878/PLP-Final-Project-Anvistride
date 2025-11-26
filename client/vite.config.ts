import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import path from "path";



export default defineConfig({

  plugins: [

    react({

      jsxRuntime: "automatic",

    }),

  ],



  resolve: {

    alias: {

      "@": path.resolve(__dirname, "./src"),

    },

  },



  test: {

    globals: true,

    environment: "jsdom",

    setupFiles: "./src/test/setup.ts",

    css: true,

  },



  server: {

    port: 5173,

  },



  build: {

    target: "esnext",

    minify: "esbuild", 
    sourcemap: false,

    cssCodeSplit: true,



    rollupOptions: {

      output: {

        chunkFileNames: "assets/js/[name]-[hash].js",

        entryFileNames: "assets/js/[name]-[hash].js",

        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },



        manualChunks(id) {

          if (id.includes("node_modules")) {

            if (id.includes("react") || id.includes("react-dom")) {

              return "react-vendor";

            }

            if (id.includes("react-router-dom")) {

              return "router-vendor";

            }

            if (id.includes("lucide-react")) {

              return "icons-vendor";

            }

            if (id.includes("framer-motion")) {

              return "motion-vendor";

            }

            if (id.includes("axios")) {

              return "axios-vendor";

            }

            return "vendor";

          }

        },

      },

    },



    assetsInlineLimit: 4096,

    chunkSizeWarningLimit: 700,

  },

});
