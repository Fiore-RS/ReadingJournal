/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Nunito'", "sans-serif"],
      },
      colors: {
        cream: "#f6efe2",
        parchment: "#fbf5e9",
        clay: "#4a3527",
        bark: "#5c4632",
        latte: "#6b4a34",
        espresso: "#5c3d29",
        sage: {
          DEFAULT: "#7d9d6e",
          soft: "#a9c19a",
        },
        blush: "#e3b8c4",
        honey: "#d9a05b",
        sand: "#8a7862",
        driftwood: "#a89577",
      },
      keyframes: {
        fadein: { from: { opacity: 0 }, to: { opacity: 1 } },
        popin: {
          from: { opacity: 0, transform: "translateY(14px) scale(0.97)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "swipe-in-right": {
          from: { opacity: 0, transform: "translateX(56px) scale(0.97)" },
          to: { opacity: 1, transform: "translateX(0) scale(1)" },
        },
        "swipe-in-left": {
          from: { opacity: 0, transform: "translateX(-56px) scale(0.97)" },
          to: { opacity: 1, transform: "translateX(0) scale(1)" },
        },
      },
      animation: {
        fadein: "fadein 0.2s ease",
        popin: "popin 0.25s ease",
        floaty: "floaty 5s ease-in-out infinite",
        "swipe-in-right": "swipe-in-right 1.5s cubic-bezier(0.22,1,0.36,1)",
        "swipe-in-left": "swipe-in-left 1.5s cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};
