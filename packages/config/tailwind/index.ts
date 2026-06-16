import type { Config } from "tailwindcss";

export const sharedConfig: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1A56DB",
          "blue-dark": "#1447C4",
          dark: "#1E293B",
          slate: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
};
