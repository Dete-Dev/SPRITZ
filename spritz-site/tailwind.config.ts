import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#f4ede2",
        bone: "#ebe2d2",
        ink: "#1a1411",
        amber: "#b87333",
        rust: "#8a3a1a",
        sage: "#7a8b6b",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        widest: "0.4em",
      },
    },
  },
  plugins: [],
};

export default config;
