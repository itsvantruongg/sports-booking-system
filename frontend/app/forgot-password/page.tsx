"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || "Có lỗi xảy ra" });
      } else {
        setMessage({ type: 'success', text: "Email hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Lỗi kết nối đến máy chủ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf8ff] text-[#191b25] font-sans min-h-screen flex items-center justify-center p-4 antialiased overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fbf8ff]/80 to-[#ededfb]/90"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#0052ff] opacity-10 blur-[80px] rounded-full transform-gpu"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-[#006e2a] opacity-5 blur-[80px] rounded-full transform-gpu"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-black text-5xl tracking-tighter text-[#003ec7] hover:opacity-80 transition-opacity" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              KINETIC
            </h1>
          </Link>
          <p className="text-[#434656] mt-2 text-sm font-bold tracking-widest uppercase">Khôi phục quyền truy cập</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_24px_60px_rgba(25,27,37,0.08)] p-8 md:p-12 relative overflow-hidden border border-white/50">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#003ec7] to-[#0052ff]"></div>

          <h2 className="text-3xl font-bold tracking-tight text-[#191b25] mb-4 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Quên mật khẩu?
          </h2>
          <p className="text-[#737688] text-center mb-8 text-sm leading-relaxed">
            Đừng lo lắng, hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để bạn đặt lại mật khẩu mới.
          </p>

          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-2 text-lg">
                  {message.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#434656] ml-1" htmlFor="email">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#003ec7]">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input
                  className="block w-full pl-14 pr-5 py-4 bg-[#f3f2ff] border-0 outline-none rounded-2xl text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7]/20 focus:bg-white transition-all duration-300"
                  id="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 rounded-full shadow-[0_12px_24px_rgba(0,62,199,0.2)] text-white bg-gradient-to-r from-[#003ec7] to-[#0052ff] hover:from-[#0052ff] hover:to-[#003ec7] font-bold text-lg transition-all duration-300 transform active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
                <span className="material-symbols-outlined ml-2 text-2xl group-hover:translate-x-1 transition-transform">send</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-[#f3f2ff] pt-6">
            <Link href="/login" className="inline-flex items-center text-sm font-bold text-[#003ec7] hover:text-[#0052ff] transition-colors group">
              <span className="material-symbols-outlined mr-2 text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
