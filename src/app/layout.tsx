import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@theme/ThemeProvider";
import { ToastProvider } from "@toast/ToastProvider";
import Navbar from "@navbar/Navbar";
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
				className={`h-[100svh] w-full overflow-hidden bg-background text-foreground ${geistSans.variable} ${geistMono.variable}`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ToastProvider>
						<div className="flex h-full">
							<Navbar />
							<main className="flex-1 flex flex-col overflow-y-auto pb-[env(safe-area-inset-bottom)]">
								{children}
							</main>
						</div>
					</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}