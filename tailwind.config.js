/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: { DEFAULT: '#05070B', light: '#0F172A' },
        accent: { violet: '#7C3AED', cyan: '#06B6D4' },
        muted: '#94A3B8',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
