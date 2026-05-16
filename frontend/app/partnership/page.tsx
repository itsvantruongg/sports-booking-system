"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    name: "",
    fieldName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/public/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", fieldName: "", phone: "", email: "", message: "" });
      } else {
        const data = await res.json();
        alert(data.message || "Gửi yêu cầu thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối tới hệ thống");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24">
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
            Hợp tác cùng KINETIC
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-on-surface mb-6 leading-none">
            Nâng tầm <span className="text-primary italic">Sân thể thao</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
            Hệ thống quản lý chuyên nghiệp giúp bạn tối ưu doanh thu và vận hành tự động 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Info & Contact */}
          <div className="lg:col-span-5 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-on-surface mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Tại sao chọn chúng tôi?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: "analytics", title: "Báo cáo thực tế", desc: "Theo dõi doanh thu từng phút, minh bạch và chính xác." },
                  { icon: "bolt", title: "Vận hành tự động", desc: "Giảm 80% công việc thủ công nhờ hệ thống đặt lịch thông minh." },
                  { icon: "verified_user", title: "Uy tín tuyệt đối", desc: "Cộng đồng người chơi đông đảo và tin cậy." }
                ].map((item, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface mb-1">{item.title}</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface-container-high/30 rounded-[40px] p-8 border border-outline-variant/20 shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_support</span>
                Liên hệ trực tiếp
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-outline-variant/10 hover:border-primary hover:shadow-md transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">call</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Hotline Admin</p>
                    <p className="font-black text-on-surface text-base">039 726 3588 (Mr. Trường)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-outline-variant/10 hover:border-primary hover:shadow-md transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Email Hợp tác</p>
                    <p className="font-black text-on-surface text-base">partner@kinetic.io</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-outline-variant/10 hover:border-primary hover:shadow-md transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">chat</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Zalo Official</p>
                    <p className="font-black text-on-surface text-base">KINETIC Platform</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-outline-variant/10 relative overflow-hidden">
              {isSuccess ? (
                <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                  </div>
                  <h2 className="text-3xl font-black text-on-surface mb-4">Gửi thông tin thành công!</h2>
                  <p className="text-on-surface-variant mb-12 max-w-sm mx-auto">Đội ngũ chuyên viên của KINETIC sẽ liên hệ tư vấn cho bạn sớm nhất có thể.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-10 py-4 bg-primary/10 text-primary rounded-full font-black text-sm hover:bg-primary/20 transition-all active:scale-95 border border-primary/20"
                  >
                    Quay lại form
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-on-surface mb-3">Đăng ký ngay</h2>
                    <p className="text-on-surface-variant font-medium">Hoàn thành mẫu dưới đây, chúng tôi sẽ xử lý yêu cầu trong 1h.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Họ và tên</label>
                        <input
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-surface-container border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-on-surface"
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Số điện thoại</label>
                        <input
                          required
                          type="tel"
                          className="w-full px-6 py-4 rounded-2xl bg-surface-container border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-on-surface"
                          placeholder="Số điện thoại cá nhân"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Tên sân/Cơ sở kinh doanh</label>
                      <input
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-surface-container border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-on-surface"
                        placeholder="Tên sân bóng, cầu lông, tennis..."
                        value={formData.fieldName}
                        onChange={e => setFormData({ ...formData, fieldName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Địa chỉ email</label>
                      <input
                        required
                        type="email"
                        className="w-full px-6 py-4 rounded-2xl bg-surface-container border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-on-surface"
                        placeholder="Email để nhận tài liệu hướng dẫn"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Ghi chú yêu cầu</label>
                      <textarea
                        rows={3}
                        className="w-full px-6 py-4 rounded-2xl bg-surface-container border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-on-surface resize-none"
                        placeholder="Bạn có yêu cầu đặc biệt nào không?"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-primary text-on-primary rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu ngay"}
                    </button>
                    <p className="text-center text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">Bằng cách gửi form, bạn đồng ý với chính sách của KINETIC</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-outline-variant/10 py-16 bg-surface-container-lowest/50 mt-12">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter text-primary">KINETIC</Link>
            <div className="hidden md:flex gap-8 text-sm font-bold text-on-surface-variant">
              <Link href="/fields" className="hover:text-primary transition-colors">Sân bãi</Link>
              <Link href="/partnership" className="text-primary underline underline-offset-4">Hợp tác</Link>
              <Link href="#" className="hover:text-primary transition-colors">Về chúng tôi</Link>
            </div>
          </div>
          <div className="flex gap-10 text-on-surface-variant text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-primary">Điều khoản</a>
            <a href="#" className="hover:text-primary">Bảo mật</a>
            <a href="#" className="hover:text-primary">Hỗ trợ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
