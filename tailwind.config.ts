import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "strong-border": "hsl(var(--strong-border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Status Semantics
        status: {
          success: "hsl(var(--success))",
          "success-foreground": "hsl(var(--success-foreground))",
          warning: "hsl(var(--warning))",
          "warning-foreground": "hsl(var(--warning-foreground))",
          danger: "hsl(var(--danger))",
          "danger-foreground": "hsl(var(--danger-foreground))",
          info: "hsl(var(--info))",
          "info-foreground": "hsl(var(--info-foreground))",
        },

        // GridWise Energy Domain Semantics
        energy: {
          solar: "var(--energy-solar)",
          "solar-bg": "var(--energy-solar-bg)",
          battery: "var(--energy-battery)",
          "battery-bg": "var(--energy-battery-bg)",
          grid: "var(--energy-grid)",
          "grid-bg": "var(--energy-grid-bg)",
          demand: "var(--energy-demand)",
          "demand-bg": "var(--energy-demand-bg)",
          tariff: "var(--energy-tariff)",
          "tariff-bg": "var(--energy-tariff-bg)",
        },

        // Directive Status Semantics
        directive: {
          solar: "var(--directive-solar)",
          reserve: "var(--directive-reserve)",
          nocharge: "var(--directive-nocharge)",
          nodischarge: "var(--directive-nodischarge)",
          gridcap: "var(--directive-gridcap)",
          noop: "var(--directive-noop)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        micro: "150ms",
        component: "250ms",
        page: "300ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
