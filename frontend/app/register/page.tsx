"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ");
      console.error(error);
    }
  };

  return (
    <div className="bg-[#fbf8ff] text-[#191b25] min-h-screen flex items-center justify-center p-4 antialiased relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[120vw] h-[1228px] bg-gradient-to-br from-[#003ec7]/5 to-[#006e2a]/5 rounded-full blur-[100px] opacity-70"></div>
        <img 
          alt="Background" 
          className="w-full h-full object-cover opacity-5 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwviQL5eH5KLB6DXRSN-buIy3oiUY1nnVNftLzIQy3lD8ZIDRGB3ZXN32mUKVkptOAqPbeFBNvOqdZnNC1iSE5BkXLEvgneGMt1tkP4ptjkhdgzgAmOjS9IPRzU3p96yh3CRVuByUyfan-zIKRydxHsbS2EgcCsfSwF8oWSYlevdePCHJsl-oU3c2SrUHKEPK4Ywl5pctr7zinE03X9WZUFPxB8cvK8roG89XIZ4ShHFWz1lPKKP9hq9_RPjv8cZS3tMeHZxgF-ds"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_24px_80px_rgba(25,27,37,0.08)] overflow-hidden flex flex-col md:flex-row border border-white/50">
        {/* Left Side: Branding / Image */}
        <div className="hidden md:block md:w-2/5 relative bg-[#f3f2ff] overflow-hidden">
          <img 
            alt="Athlete Preparation" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoHNHwPO9PIV5B_jpO6WczAklpPJR6JLLypZU6pW14W_-D6VhBAC-HZm4Gq_iuinCvNutE1CiBKvN7dj4lhoXCtWCrBmfImaW7RTobIR4Uj8__093ds50FtYgWnAmekh62JDwroe3Qxp9ANePUd5KuY85mzd_5puDUyFbgCYreiZ29KTtddYudcg0JAjj8s7DaLy9p2SkC9gMH0o6Ri3u9kynFtPCntOykEKW5MNDs1FWt4_QtpsoMsZFtqHmDZFexhP_bxfZsoOk"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001452]/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 w-full">
            <span className="font-black text-4xl tracking-tighter text-white mb-2 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>KINETIC</span>
            <p className="text-[#b7c4ff] text-lg font-medium">Tham gia cộng đồng tinh hoa. Nâng tầm cuộc chơi ngay hôm nay.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 p-8 md:p-14 bg-white/50">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-[#191b25] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Đăng ký Tài khoản</h1>
            <p className="text-[#434656] text-lg font-medium">Nhập thông tin của bạn để bắt đầu.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#191b25] ml-1" htmlFor="fullName">Họ và Tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#737688] group-focus-within:text-[#003ec7] transition-colors">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <input 
                  className="w-full pl-14 pr-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7] focus:bg-white transition-all font-medium outline-none" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Nguyễn Văn A" 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#191b25] ml-1" htmlFor="email">Địa chỉ Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#737688] group-focus-within:text-[#003ec7] transition-colors">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <input 
                  className="w-full pl-14 pr-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7] focus:bg-white transition-all font-medium outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="nguyenvana@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#191b25] ml-1" htmlFor="phone">Số điện thoại</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#737688] group-focus-within:text-[#003ec7] transition-colors">
                  <span className="material-symbols-outlined text-xl">call</span>
                </div>
                <input 
                  className="w-full pl-14 pr-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7] focus:bg-white transition-all font-medium outline-none" 
                  id="phone" 
                  name="phone" 
                  placeholder="03xxxxxxxx" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#191b25] ml-1" htmlFor="password">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#737688] group-focus-within:text-[#003ec7] transition-colors">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input 
                  className="w-full pl-14 pr-14 py-4 bg-[#f3f2ff] rounded-2xl border-none text-[#191b25] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7] focus:bg-white transition-all font-medium outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#737688] hover:text-[#003ec7] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start mt-6 ml-1">
              <div className="flex items-center h-5">
                <input className="w-5 h-5 rounded border-[#c3c5d9] text-[#003ec7] focus:ring-[#003ec7] bg-white cursor-pointer" id="terms" name="terms" type="checkbox" required />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-[#434656] cursor-pointer" htmlFor="terms">
                  Tôi đồng ý với các <span className="text-[#003ec7] font-bold hover:underline">Điều khoản</span> và <span className="text-[#003ec7] font-bold hover:underline">Chính sách bảo mật</span>.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                className="w-full bg-gradient-to-r from-[#003ec7] to-[#0052ff] text-white font-bold text-lg py-5 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_12px_24px_rgba(0,62,199,0.2)] hover:shadow-[0_16px_32px_rgba(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0 active:shadow-none group" 
                type="submit"
              >
                Đăng ký Tài khoản
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-[#434656]">
              Bạn đã có tài khoản? 
              <Link href="/login" className="text-[#003ec7] font-black hover:text-[#0052ff] hover:underline transition-colors ml-2 underline underline-offset-4">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
