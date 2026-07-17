"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "linear-gradient(160deg, #FFF5F5 0%, #FFE4E1 35%, #FDDCDC 65%, #FFF0F5 100%)",
        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
      }}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(196,129,129,0.1)",
          boxShadow: "0 8px 40px rgba(196,129,129,0.08)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(196,129,129,0.1)" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-7 h-7 fill-current" style={{ color: "#C48181" }} />
        </motion.div>

        <h1
          className="text-2xl mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}
        >
          管理后台
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9B7070" }}>
          请输入管理密码
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#D4A38B" }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理密码"
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: error ? "1px solid #e53e3e" : "1px solid rgba(196,129,129,0.15)",
                color: "#3D2B2B",
              }}
              autoFocus
            />
          </div>
          {error && (
            <motion.p
              className="text-xs mb-4 text-left"
              style={{ color: "#e53e3e" }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              密码错误，请重试
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="w-full rounded-xl py-3 text-sm font-medium text-white"
            style={{ background: "#C48181" }}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(196,129,129,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            进入后台
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
