import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563eb", // Blue-600
                secondary: "#475569", // Slate-600
                brand: {
                    black: '#111827', // Penguin Body
                    white: '#F9FAFB', // Background
                    marigold: '#F59E0B', // Beak/Accent (Indian festive)
                    ocean: '#0EA5E9', // Water/Trust
                    navy: '#1E3A8A', // Deep Trust
                }
            }
        },
    },
    plugins: [],
};
export default config;
