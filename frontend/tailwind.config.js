/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                rog: {
                    red: '#ff0033',
                    dark: '#0a0a0a',
                    panel: '#1a1a1a',
                },
                lambo: {
                    yellow: '#ffcc00',
                    gold: '#d4af37',
                },
                neon: {
                    blue: '#00f3ff',
                    green: '#39ff14',
                },
                carbon: {
                    black: '#111111',
                    fiber: '#222222',
                }
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                rajdhani: ['Rajdhani', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'carbon-pattern': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
            }
        },
    },
    plugins: [],
}
