
const colors = {
  'base': '#260052',
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        DEFAULT: '#000',
        'transparent': 'transparent',
        'base': colors.base,
        'base-dark': '#4b00a1',
        'base-background':'#15002e',
        'over': '#8c00ff',
        'active': '#8c00ff',
        'body': '#6200b3',
        'font': {
          'base': '#eee',  
          'over': '#fff',
          'active': '#fff',
        },
        'btn': {
          'base': '#260052',
          'over': '#4b00a1',
        },
        'tab': {
          'base': colors.base,
          'active': '#6200b3'
        },
        'layer': {
          'base': '#0a0016',
        },
        'input': {
          'background': '#6400b6',
        }
      },
      width: {
        '100px': '100px',
        '200px': '200px',
      },
      rotate : {
        '270': '270deg',
      }
    },
  },
  plugins: [],
}