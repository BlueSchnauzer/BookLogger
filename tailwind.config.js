/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        vellum: '#eeeae3'
      },
      gridTemplateColumns: {
        smBookContentAutoFit: 'repeat(auto-fit, minmax(128px, 1fr))',
        BookContentAutoFill: 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },

  plugins: [],
}

