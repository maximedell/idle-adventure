/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#3e3e3e",
				"primary-light": "#727272",
				"primary-dark": "#151515",
				secondary: "#c3af97",
				accent: "#962626",
			},
			fontFamily: {
				sans: ["Roboto", "sans-serif"],
			},
			border: {
				xs: "1px",
			},
		},
	},
	plugins: [],
};
