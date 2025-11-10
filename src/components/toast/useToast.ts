"use client";
import { useToastContext } from "./ToastProvider";

export function useToast() {
    const { showToast } = useToastContext();
    return { showToast };
}