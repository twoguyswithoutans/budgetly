"use client";
import type { Toast } from "./ToastProvider";
import { Check, ShieldAlert, Info } from "lucide-react";

export function ToastItem({ toast }: { toast: Toast }) {
	const Icon =
			toast.type === "success" ? Check :
			toast.type === "error" ? ShieldAlert : Info;

	const color = 
			toast.type === "success" ? "bg-green-600" :
			toast.type === "error" ? "bg-red-600": "bg-blue-600";

	return (
		<div
			className={`flex justify-center items-center gap-x-2 w-fit px-4 py-2 text-white rounded-md shadow-md animate-fade-in ${color}`}
		>
			<Icon size={15} />
			{toast.message}
		</div>
	);
}