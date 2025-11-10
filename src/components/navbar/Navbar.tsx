"use client";
import { useRouter, usePathname } from "next/navigation";
import { BanknoteArrowDown, LayoutDashboard, Milestone, SquareKanban } from "lucide-react";
import ThemeToggle from "@theme/ThemeToggle";
import { NavItem } from "@models";

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{ name: "Dashboard", path: "/", icon: LayoutDashboard },
		{ name: "Expenses", path: "/expenses", icon: BanknoteArrowDown },
		{ name: "Goals", path: "/goals", icon: Milestone },
		{ name: "Overview", path: "/overview", icon: SquareKanban },
	];

	const renderNavButton = (item: NavItem, isMobile = false) => {
		const isActive = pathname === item.path;
		const Icon = item.icon;

		const baseClass = isMobile
			? "flex flex-col items-center justify-center w-full h-full text-xs font-semibold transition-colors"
			: "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors";

		const activeClass = isMobile
			? isActive ? "text-white" : "text-gray-300"
			: isActive ? "bg-[#345b88]" : "hover:bg-[#274a72]";

		return (
			<button
				key={item.name}
				onClick={() => router.push(item.path)}
				className={`${baseClass} ${activeClass}`}
			>
				<div className="flex items-center justify-center w-6 h-6">
					<Icon size={22} />
				</div>
				{!isMobile && item.name}
			</button>
		);
	};

	return (
		<>
			{/* Bottom Nav (Mobile) */}
			<nav className="fixed bottom-0 left-0 w-full h-[10svh] bg-[#1d3c60] z-50 flex justify-around items-center pb-[env(safe-area-inset-bottom)] lg:hidden">
				{navItems.map((item) => renderNavButton(item, true))}
				<div className="mr-4 md:mr-10">
					<ThemeToggle />
				</div>
			</nav>

			{/* Side Nav (Desktop) */}
			<aside className="hidden lg:flex flex-col w-[20vw] h-screen bg-[#1d3c60] text-white p-6">
				<h1 className="text-2xl font-extrabold mb-10">Budgetly</h1>

				<div className="flex flex-col gap-2">
					{navItems.map((item) => renderNavButton(item))}
				</div>

				<div className="mt-auto">
					<ThemeToggle />
				</div>
			</aside>
		</>
	);
}
