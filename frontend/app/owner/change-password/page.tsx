"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OwnerChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const toggleVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      console.log('--- Debug Change Password ---');
      console.log('Token exists:', !!token);
      
      if (!token) {
        alert("LỖI: Không tìm thấy Token trong trình duyệt. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/force-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("must_change_password", "false");
        alert("Đổi mật khẩu thành công! Chào mừng bạn đến với KINETIC.");
        router.push("/owner");
      } else {
        if (res.status === 401) {
          alert("LỖI 401: Server từ chối Token hoặc đã hết hạn thực tế.");
          localStorage.clear();
          router.push("/login");
        } else {
          alert(data.message || "Có lỗi xảy ra từ Server");
        }
      }
    } catch (error) {
      alert("Lỗi kết nối server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <main className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-4xl tracking-tighter text-primary">KINETIC</h1>
          <p className="font-body text-on-surface-variant text-sm mt-2">Partner Security Update</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-[0_24px_80px_rgba(25,27,37,0.1)] p-8 sm:p-10 relative overflow-hidden border border-outline-variant/10">
          <div className="mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
              <span className="material-symbols-outlined font-bold">shield_lock</span>
            </div>
            <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface mb-2">Update Required</h2>
            <p className="font-body text-on-surface-variant text-sm leading-relaxed">For your security, please create a new password to access your Kinetic Partner Portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Old Password */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
              <div className="relative group">
                <input 
                  required
                  className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-4 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white outline-none transition-all pr-14" 
                  placeholder="Nhập mật khẩu từ Email" 
                  type={showPasswords.old ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('old')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.old ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Mật khẩu mới</label>
              <div className="relative group">
                <input 
                  required
                  className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-4 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white outline-none transition-all pr-14" 
                  placeholder="Tối thiểu 8 ký tự" 
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.new ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
              <div className="relative group">
                <input 
                  required
                  className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-4 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white outline-none transition-all pr-14" 
                  placeholder="Nhập lại mật khẩu mới" 
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.confirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-on-primary font-display font-black text-lg rounded-2xl py-5 px-6 hover:shadow-[0_20px_40px_rgba(0,62,199,0.2)] transition-all duration-300 transform active:scale-[0.97] mt-6 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              type="submit"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Update Password
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/login" className="font-body text-sm font-black text-primary hover:opacity-80 transition-all flex items-center justify-center gap-2 group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </main>
    </div>
  );
}