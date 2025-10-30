'use client';
import ThemeToggle from "components/theme/themeToggle";
import { useRouter, usePathname } from 'next/navigation'
import { BanknoteArrowDown, LayoutDashboard, Milestone, SquareKanban } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "Expenses",
            icon: <BanknoteArrowDown size={20} />,
        },
        {
            name: "Goals",
            icon: <Milestone size={20} />,
        },
        {
            name: "Overview",
            icon: <SquareKanban size={20} />,
        },
    ]

    return (
        <div className="h-screen w-[25vw] flex flex-col items-center py-8 bg-[#1d3c60] text-navbar-foreground z-10">
            <div className="flex">
                <div className="text-3xl font-extrabold text-white mb-10">
                    Budgetly
                </div>
            </div>
            <div className="py-4 px-3 w-full h-fit md:flex flex-col gap-y-3 justify-center items-start text-white">
                {navItems.map((item) => {
                    const path = item.name.toLowerCase() === "dashboard" ? "/" : `/${item.name.toLowerCase()}`;
                    const isActive = pathname === path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => router.push(path)}
                            className={`w-full rounded-lg py-3 px-4 gap-x-3 flex justify-start items-center text-white text-sm font-extrabold transition-colors cursor-pointer
                            ${
                                isActive
                                ? "bg-[#345b88]"
                                : "md:hover:bg-[#274a72] md:active:bg-[#36379f]"
                            }`}
                        >
                            <div>
                                {item.icon}
                            </div>
                            <div>
                                {item.name}
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="mt-auto">
                <ThemeToggle />
            </div>
        </div>
    )
}