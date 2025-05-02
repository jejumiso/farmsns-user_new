import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{html,js,ts,jsx,tsx,vue}', './components/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        robotoMono: ['Roboto Mono', 'monospace'], // Roboto Mono
        montserrat: ['Montserrat', 'sans-serif'], // Montserrat
        poppins: ['Poppins', 'sans-serif'], // Poppins
        openSans: ['Open Sans', 'sans-serif'], // Open Sans
        firaCode: ['Fira Code', 'monospace'], // Fira Code
        lato: ['Lato', 'sans-serif'], // Lato
      },
    },
  },
  plugins: [],
  
}

export default config
