"use client";
import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // next-pwa is disabled in dev anyway, but this keeps intent clear
    if (process.env.NODE_ENV === "development") return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("SW registered:", reg.scope);
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  }, []);

  return null;
}