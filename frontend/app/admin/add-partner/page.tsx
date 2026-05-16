"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    venueName: "",
    venueType: "",
    venueCity: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:5000/api/admin/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${formData.ownerFirstName} ${formData.ownerLastName}`,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          venue_name: formData.venueName
        })
      });

      if (res.ok) {
        alert("Tạo tài khoản chủ sân thành công! Email thông báo đã được gửi.");
        router.push("/admin/users?role=OWNER");
      } else {
        const data = await res.json();
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Lỗi kết nối hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h2 className="display-font text-4xl font-bold text-on-surface tracking-tight mb-2">Thêm Đối tác mới</h2>
          <p className="font-body text-lg text-on-surface-variant">Thêm cụm sân đối tác mới vào mạng lưới Kinetic.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-8">
            <form id="add-partner-form" onSubmit={handleSubmit} className="space-y-8 bg-surface-container-low rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative z-10 border border-outline-variant/10">
              {/* Venue Details Section */}
              <div>
                <h3 className="display-font text-2xl font-bold text-on-surface mb-6 border-b-2 border-primary/20 pb-4 inline-block text-primary">Thông tin Cụm sân</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="venueName">Tên Cụm sân</label>
                    <input 
                      required
                      className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                      id="venueName" 
                      placeholder="Ví dụ: Trung tâm Thể thao Hoa Lư" 
                      type="text" 
                      value={formData.venueName}
                      onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="venueType">Môn thể thao chính</label>
                      <select 
                        required
                        className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none cursor-pointer" 
                        id="venueType"
                        value={formData.venueType}
                        onChange={(e) => setFormData({...formData, venueType: e.target.value})}
                      >
                        <option value="">Chọn loại sân</option>
                        <option value="tennis">Sân Tennis</option>
                        <option value="padel">Sân Padel</option>
                        <option value="basketball">Bóng rổ</option>
                        <option value="turf">Sân cỏ nhân tạo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="venueCity">Thành phố</label>
                      <input 
                        required
                        className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                        id="venueCity" 
                        placeholder="Thành phố" 
                        type="text" 
                        value={formData.venueCity}
                        onChange={(e) => setFormData({...formData, venueCity: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Contact Section */}
              <div className="pt-6">
                <h3 className="display-font text-2xl font-bold text-on-surface mb-6 border-b-2 border-primary/20 pb-4 inline-block text-primary">Liên hệ Chủ sân</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="ownerFirstName">Tên</label>
                      <input 
                        required
                        className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                        id="ownerFirstName" 
                        placeholder="Tên" 
                        type="text" 
                        value={formData.ownerFirstName}
                        onChange={(e) => setFormData({...formData, ownerFirstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="ownerLastName">Họ</label>
                      <input 
                        required
                        className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                        id="ownerLastName" 
                        placeholder="Họ" 
                        type="text" 
                        value={formData.ownerLastName}
                        onChange={(e) => setFormData({...formData, ownerLastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="ownerEmail">Địa chỉ Email</label>
                    <input 
                      required
                      className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                      id="ownerEmail" 
                      placeholder="partner@example.com" 
                      type="email" 
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-bold text-on-surface mb-2" htmlFor="ownerPhone">Số điện thoại</label>
                    <input 
                      required
                      className="w-full bg-surface-container-lowest border-2 border-transparent rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all duration-200 outline-none" 
                      id="ownerPhone" 
                      placeholder="0xxx xxx xxx" 
                      type="tel" 
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Info & Action */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Security Protocol Note */}
            <div className="bg-surface-container-highest rounded-3xl p-8 relative overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div>
                  <h4 className="display-font text-lg font-bold text-on-surface mb-2">Giao thức Bảo mật</h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Vì lý do bảo mật, mật khẩu ban đầu sẽ không được thiết lập tại đây. Hệ thống sẽ tự động tạo thông tin đăng nhập và gửi liên kết thiết lập mật khẩu an toàn trực tiếp đến email của đối tác sau khi tạo thành công.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-[0_32px_80px_rgba(25,27,37,0.08)] border border-outline-variant/20 flex flex-col justify-center items-center text-center mt-auto">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-8 text-primary shadow-inner">
                <span className="material-symbols-outlined text-4xl" data-icon="rocket_launch">rocket_launch</span>
              </div>
              <h4 className="display-font text-2xl font-black text-on-surface mb-3">Sẵn sàng khởi tạo?</h4>
              <p className="font-body text-sm text-on-surface-variant mb-10 max-w-[200px]">Kiểm tra kỹ các thông tin trước khi gửi lời mời tham gia.</p>
              
              <button 
                form="add-partner-form"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-display font-black text-lg rounded-2xl py-5 px-6 hover:shadow-[0_20px_50px_rgba(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo tài khoản Đối tác"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
