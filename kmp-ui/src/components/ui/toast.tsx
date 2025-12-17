"use client";

import React, { useState } from "react";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
};

let toastId = 0;
let addToastFn: ((toast: ToastItem) => void) | null = null;

export const toast = {
  success: (message: string) => {
    addToastFn?.({ id: ++toastId, message, type: "success" });
  },
  error: (message: string) => {
    addToastFn?.({ id: ++toastId, message, type: "error" });
  },
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  addToastFn = (toastItem: ToastItem) => {
    setToasts((prev) => [...prev, toastItem]);
    // auto remove after 3s
    setTimeout(() => removeToast(toastItem.id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative p-4 rounded-lg shadow-lg border ${
            t.type === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {t.message}
          <button
            onClick={() => removeToast(t.id)}
            className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
