"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  const buttons = [
    { label: "Search Documents", href: "/search", color: "from-purple-500 to-violet-600" },
    { label: "Upload Document", href: "/upload", color: "from-green-400 to-green-600" },
  ];

  return (
    <div className="flex flex-col items-center pt-24 min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 px-4">
      <h1 className="text-2xl md:text-5xl font-extrabold text-gray-800 mb-24 text-center">
        Welcome to Document Manager
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {buttons.map((btn) => (
          <motion.button
            key={btn.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push(btn.href)}
            className={`relative overflow-hidden group w-full py-6 md:py-8 rounded-2xl text-white font-bold text-xl md:text-2xl shadow-lg cursor-pointer 
              bg-gradient-to-r ${btn.color} 
              hover:brightness-110 transition-all duration-300`}
          >
            <span className="relative z-10">{btn.label}</span>
            <span className="absolute inset-0 bg-white opacity-10 rounded-2xl pointer-events-none"></span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
