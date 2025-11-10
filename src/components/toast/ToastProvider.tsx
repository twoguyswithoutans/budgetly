"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastItem } from "./ToastItem";

export type ToastType = "success" | "error" | "info";
export type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed right-8 md:bottom-8 bottom-[calc(env(safe-area-inset-bottom)+8svh)] flex flex-col gap-2 pointer-events-none max-sm:inset-x-0 max-sm:items-center z-50">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}