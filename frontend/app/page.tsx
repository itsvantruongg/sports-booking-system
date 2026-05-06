"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for now
    router.push("/admin");
  };

  return (
    <div className="bg-[#fbf8ff] text-[#191b25] font-sans min-h-screen flex items-center justify-center p-4 antialiased overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-20" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwhu0Fy3ADcguPdl7Sxw3AHAh01r0nmX954feODjS0WZSCKibJZ6TgpGNDQWeSjE4dbWOCVi6UnEmoOFz8Qnqw4LyHqJiIfVblxPdTkMadbY9N88smsX9mTIn9ph205NZyQzTJAaOQHECreMzcyQlO8WWZRtRxx1VA0-7sCj3jK7WbMN5Pwjj6Mjjhum0wiXzbA8aRWynJonJNqQUUb6pZEHKXQ0MaPMrI75Urf5heKg5OEEfW_Pfg8_A_XPxtbdm1B40Eoj8ryuQ')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#fbf8ff]/80 to-[#ededfb]/90"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#0052ff] opacity-10 blur-[80px] rounded-full transform-gpu"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-[#006e2a] opacity-5 blur-[80px] rounded-full transform-gpu"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-black text-5xl tracking-tighter text-[#003ec7]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            KINETIC
          </h1>
          <p className="text-[#434656] mt-2 text-sm font-bold tracking-widest uppercase">Platform Portal</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_24px_60px_rgba(25,27,37,0.08)] p-8 md:p-12 relative overflow-hidden border border-white/50">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#003ec7] to-[#0052ff]"></div>
          
          <h2 className="text-3xl font-bold tracking-tight text-[#191b25] mb-8 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#434656] ml-1" htmlFor="email">Email or Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#003ec7]">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input 
                  className="block w-full pl-14 pr-5 py-4 bg-[#f3f2ff] border-0 outline-none rounded-2xl text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7]/20 focus:bg-white transition-all duration-300" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your credentials" 
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1 mr-1">
                <label className="block text-sm font-semibold text-[#434656]" htmlFor="password">Password</label>
                <a className="text-sm font-bold text-[#003ec7] hover:text-[#0052ff] transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#003ec7]">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input 
                  className="block w-full pl-14 pr-14 py-4 bg-[#f3f2ff] border-0 outline-none rounded-2xl text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7]/20 focus:bg-white transition-all duration-300" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button 
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#737688] hover:text-[#191b25] transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                className="w-full flex justify-center items-center py-4 px-6 rounded-full shadow-[0_12px_24px_rgba(0,62,199,0.2)] text-white bg-gradient-to-r from-[#003ec7] to-[#0052ff] hover:from-[#0052ff] hover:to-[#003ec7] font-bold text-lg transition-all duration-300 transform active:scale-95 group" 
                type="submit"
              >
                Login
                <span className="material-symbols-outlined ml-2 text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#434656] font-medium">
              Don't have an account? 
              <Link href="/register" className="font-bold text-[#003ec7] hover:text-[#0052ff] transition-colors ml-2 underline underline-offset-4">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
