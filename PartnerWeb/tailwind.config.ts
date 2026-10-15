import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        partner: {
          cream: "#FEF9E6",
          white: "#FFFFFF",
          surface: "#F8F7F4",
          burgundy: "#4A1525",
          pink: "#F39394",
          ink: "#2E2E2E",
          green: "#5F8651",
          gray: "#757575",
          line: "#EAE6DF",
        },
      },
      spacing: {
        gutter: "24px",
        control: "56px",
      },
    },
  },
  plugins: [],
};

export default config;
