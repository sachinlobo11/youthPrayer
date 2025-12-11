// tailwind.config.js
module.exports = 
{
  darkMode: "class", // ✅ enables manual dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
     "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",// ✅ scan all components
  ],
  theme: {
    extend: {
      animation: {
        // custom animations
        'pulse-slow': 'pulse 8s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'pulseGlow': 'pulseGlow 1.5s ease-in-out infinite',
      },
      colors: {
        neon: {
          blue: '#00faff',
          pink: '#ff00ea',
          green: '#39ff14',
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(56,189,248,0.8), 0 0 40px rgba(168,85,247,0.6)",
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, boxShadow: '0 0 10px rgba(23, 131, 246, 0.3)' },
          '50%': { opacity: 1, boxShadow: '0 0 20px rgba(18, 33, 243, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // ✅ markdown prose
  ],
};
