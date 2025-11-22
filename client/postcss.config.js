const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Optimize Tailwind CSS output
      content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
    },
    autoprefixer: {
      // Modern browser support
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
      ],
    },
    // CSS minification is handled by Vite's cssMinify
  },
};

export default config;