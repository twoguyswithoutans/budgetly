import type { Config } from "tailwindcss";

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
				primary: "var(--primary)",
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				muted: "var(--muted)",
				accent: "var(--accent)",
				navbar: {
					DEFAULT: "var(--navbar-background)",
					foreground: "var(--navbar-foreground)",
					primary: "var(--navbar-primary)",
					secondary: "var(--navbar-secondary)",
					secondary_foreground: "var(--navbar-secondary-foreground)",
					border: "var(--navbar-border)",
				},
				content: {
					DEFAULT: "var(--content-background)",
					secondary: "var(--content-secondary)",
					secondary_foreground: "var(--content-secondary-foreground)",
				}
			},
		},
	},
	plugins: [],
	darkMode: 'class',
} satisfies Config;
