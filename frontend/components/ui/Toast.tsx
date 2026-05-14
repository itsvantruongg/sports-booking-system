"use client";
import { useEffect } from "react";

interface ToastProps {
  msg: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ msg, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgStyles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const iconNames = {
    success: "check_circle",
    error: "error",
    info: "info",
  };

  return (
    <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${bgStyles[type]}`}>
      <span className="material-symbols-outlined">{iconNames[type]}</span>
      {msg}
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
