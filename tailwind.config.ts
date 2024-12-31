import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        box: '#2D2A2B',
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    prefix: "daisy-",
    themes: [
      "light",
      "dark",
      {
        mytheme: {

          "primary": "#37c390",

          "secondary": "#dc848e",

          "accent": "#a7ceb8",

          "neutral": "#0a140e",

          "base-100": "#f4ffff",

          "info": "#00a4ff",

          "success": "#a5e000",

          "warning": "#9f7000",

          "error": "#ef4b6a",

          "box": "#2D2A2B"
        },
      },

    ],
  }
} satisfies Config;
