'use client';
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "../theme/ThemeToggle";
import { BanknoteArrowDown, LayoutDashboard, Milestone, SquareKanban } from "lucide-react";

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();

	const navItems = [
		{ name: "Dashboard", icon: LayoutDashboard },
		{ name: "Expenses", icon: BanknoteArrowDown },
		{ name: "Goals", icon: Milestone },
		{ name: "Overview", icon: SquareKanban },
	];

	return (
		<>
			{/* Bottom Nav (Mobile) */}
			<div className="fixed md:hidden bottom-0 left-0 w-full h-[10svh] bg-[#1d3c60] z-50 flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
				{navItems.map((item) => {
					const path = item.name === "Dashboard" ? "/" : `/${item.name.toLowerCase()}`;
					const isActive = pathname === path;
					const Icon = item.icon;

					return (
						<button
							key={item.name}
							onClick={() => router.push(path)}
							className={`flex flex-col items-center justify-center text-xs transition-colors font-semibold ${
								isActive ? "text-white" : "text-gray-300"
							}`}
						>
							<Icon size={20} />
						</button>
					);
				})}
				<ThemeToggle />
			</div>

			{/* Side Nav (Desktop) */}
			<div className="hidden md:flex flex-col w-[20vw] h-screen bg-[#1d3c60] text-white p-6">
				<h1 className="text-2xl font-extrabold mb-10">Budgetly</h1>

				<div className="flex flex-col gap-2">
					{navItems.map((item) => {
						const path = item.name === "Dashboard" ? "/" : `/${item.name.toLowerCase()}`;
						const isActive = pathname === path;
						const Icon = item.icon;

						return (
							<button
								key={item.name}
								onClick={() => router.push(path)}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
									isActive ? "bg-[#345b88]" : "hover:bg-[#274a72]"
								}`}
							>
								<Icon size={20} />
								{item.name}
							</button>
						);
					})}
				</div>

				<div className="mt-auto">
					<ThemeToggle />
				</div>
			</div>
		</>
	);
}