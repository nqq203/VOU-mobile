/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EA661C",
        bg: "#FFFBF8",
        black: '#0F0F0F',
        white: '#FDFDFD',
        red: '#FF4C4C',    // Error
        pending: '#F1C232', // Yellow 
        active: '#56CC56',  // green 
        infoBlue: '#2196F3',   // Info
        yellow: {
          50: '#FFF5D9',
          100: '#56CC56',
        },
        blue: {
          50: '#E7EDFF',
          100: '#396AFF',
          200: '#718EBF',
        },
        pink: {
          50: '#FFE0EB',
          100: '#FF82AC',
        },
        green: {
          50: '#DCFAF8',
          100: '#16DBCC',
        },
        
        grey:{
          50: "#F4F4F4",
          100: "#DEDEDE",
          200: "#CECECE",
          300: "#B7B7B7",
          400: "#A9A9A9",
          500: "#949494",
          600: "#878787",
          700: "#696969",
          800: "#515151",
          900: "#3E3E3E",
        },
        brown: {
          50: "#FDF0E8",
          100: "#F8D0B9",
          200: "#F5B997",
          300: "#F19867",
          400: "#EE8549",
          500: "#EA661C",
          600: "#D55D19",
          700: "#A64814",
          800: "#81380F",
          900: "#622B0C",
        },
        
      },
      fontFamily: {
        pthin: ['Inter-Thin', 'sans-serif'],
        pextralight: ['Inter-ExtraLight', 'sans-serif'],
        plight: ['Inter-Light', 'sans-serif'],
        pregular: ['Inter-Regular', 'sans-serif'],
        pmedium: ['Inter-Medium', 'sans-serif'],
        psemibold: ['Inter-SemiBold', 'sans-serif'],
        pbold: ['Inter-Bold', 'sans-serif'],
        pextrabold: ['Inter-ExtraBold', 'sans-serif'],
        pblack: ['Inter-Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

