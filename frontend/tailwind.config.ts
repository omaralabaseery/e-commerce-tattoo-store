import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // luxurious minimalist palette: white-dominant, black accents, light gray
        ink: {
          DEFAULT: "#111111",
          soft: "#1a1a1a",
        },
        paper: "#ffffff",
        mist: "#f5f5f5",
        line: "#eaeaea",
        muted: "#6b6b6b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "Cairo", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1440px",
        content: "1280px",
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
      },
      fontSize: {
        // refined display scale with optical tracking (Apple/Linear feel)
        display: ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        "display-sm": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        card: "16px",
        xl2: "20px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 8px 24px rgba(17,17,17,0.06)",
        lift: "0 18px 50px -12px rgba(17,17,17,0.18)",
        glass: "0 8px 32px rgba(17,17,17,0.08)",
        hairline: "0 0 0 1px rgba(17,17,17,0.06)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        floatXY: {
          "0%, 100%": { transform: "translate(-8px, -10px)" },
          "50%": { transform: "translate(8px, 10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scrollCue: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(10px)", opacity: "0" },
        },
      },
      animation: {
        floatY: "floatY 8s ease-in-out infinite",
        floatYslow: "floatY 11s ease-in-out infinite",
        floatXY: "floatXY 14s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        fadeUp: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 32s linear infinite",
        scrollCue: "scrollCue 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
