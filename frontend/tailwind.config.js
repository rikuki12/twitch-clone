module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        twitch: {
          purple: "#9146FF",
          "purple-dark": "#772CE8",
          "purple-light": "#A970FF", 
          dark: "#0e0e10",
          "dark-light": "#18181b",
          "dark-lighter": "#1f1f23",
          gray: "#464649",
          "gray-light": "#adadb8"
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
