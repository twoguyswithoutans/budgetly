import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "components/theme/theme-provider"
import Navbar from "navbar/Navbar";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Budget App",
	description: "A simple budget app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={`fixed w-screen h-screen flex bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					<div className="w-full flex items-center justify-center">
						{children}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}