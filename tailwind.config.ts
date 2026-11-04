import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#131313",
          dim: "#131313",
          bright: "#3a3939",
          container: {
            lowest: "#0e0e0e",
            low: "#1c1b1b",
            DEFAULT: "#201f1f",
            high: "#2a2a2a",
            highest: "#353534",
          },
          100: "#1a1a1a",
          200: "#2a2a2a",
          300: "#3a3a3a",
        },
        primary: {
          DEFAULT: "#ffb1c3",
          container: "#d80b69",
        },
        secondary: {
          DEFAULT: "#ffd405",
          container: "#fbd100",
        },
        on: {
          surface: "#e5e2e1",
          "surface-variant": "#e2bdc4",
          "primary-container": "#fff0f1",
          "secondary-container": "#6d5a00",
        },
        tertiary: {
          DEFAULT: "#c8c6c5",
          "fixed-dim": "#c8c6c5",
        },
        provider: {
          netflix: "#e50914",
          disney: "#113ccf",
          prime: "#00a8e1",
          crunchyroll: "#f47521",
        },
      },
      fontFamily: {
        sans: [
          "Roboto Flex",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
