/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#00c6a7',
        secondary: '#0f4c75',
        background: '#f8f9fa',
        text: '#1a1a1a',
        accent: '#ffffff',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to right, #00c6a7, #0f4c75)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}
