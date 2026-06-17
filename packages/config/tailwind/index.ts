import type { Config } from "tailwindcss";

export const sharedConfig: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // ── BASE PALETTE ──────────────────────────────────────────
        "navy-deep":    "#0B1220",
        "blue-primary": "#2563EB",
        "teal-accent":  "#14B8A6",
        "dark-surface": "#1E293B",
        "gray-50-lm":   "#F8FAFC",
        "gray-200-lm":  "#E2E8F0",
        "gray-400-lm":  "#94A3B8",
        "gray-700-lm":  "#334155",
        "green-600-lm": "#16A34A",
        "amber-600-lm": "#D97706",
        "orange-600-lm":"#EA580C",
        "red-600-lm":   "#DC2626",
        gold:           "#D4AF37",

        // ── SEMANTIC TOKENS (components use these, never base palette) ──
        background: {
          page:    "var(--color-background-page)",
          card:    "var(--color-background-card)",
          feature: "var(--color-background-feature)",
        },
        foreground: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary:  "var(--color-text-tertiary)",
          "on-dark": "var(--color-text-on-dark)",
        },
        interactive: {
          primary: "var(--color-interactive-primary)",
          hover:   "var(--color-interactive-hover)",
        },
        "border-token": {
          default: "var(--color-border-default)",
        },
        status: {
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          danger:  "var(--color-status-danger)",
          info:    "var(--color-status-info)",
        },
        premium: "var(--color-premium)",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "Consolas", "monospace"],
      },

      fontSize: {
        "display-hero":  ["3rem",       { lineHeight: "1.1" }],
        "display-large": ["2.25rem",    { lineHeight: "1.2" }],
        h1:              ["1.5rem",     { lineHeight: "1.3" }],
        h2:              ["1.25rem",    { lineHeight: "1.4" }],
        h3:              ["1rem",       { lineHeight: "1.5" }],
        "body-lg":       ["1rem",       { lineHeight: "1.6" }],
        "body-md":       ["0.875rem",   { lineHeight: "1.5" }],
        "body-sm":       ["0.75rem",    { lineHeight: "1.5" }],
        "data-mono":     ["0.875rem",   { lineHeight: "1.4" }],
        "label-caps":    ["0.6875rem",  { lineHeight: "1.2", letterSpacing: "0.06em" }],
      },

      borderRadius: {
        sm:   "4px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl":"24px",
        full: "9999px",
      },

      boxShadow: {
        "1": "0 1px 3px rgba(0,0,0,0.08)",
        "2": "0 4px 16px rgba(0,0,0,0.10)",
        "3": "0 8px 32px rgba(0,0,0,0.14)",
        "4": "0 16px 48px rgba(0,0,0,0.18)",
      },

      transitionDuration: {
        instant: "50ms",
        fast:    "100ms",
        normal:  "200ms",
        slow:    "300ms",
        xslow:   "500ms",
        reveal:  "1200ms",
      },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        enter:    "cubic-bezier(0, 0, 0.2, 1)",
        exit:     "cubic-bezier(0.4, 0, 1, 1)",
        spring:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      maxWidth: {
        content:   "1280px",
        "card-sm": "480px",
        "card-md": "600px",
      },
    },
  },
};
