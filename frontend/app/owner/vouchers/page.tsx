"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Voucher {
  _id: string;
  code: string;
  discount_type: 'PERCENT' | 'FIXED';
  discount_value: number;
  min_booking_amount: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function VouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "PERCENT",
    discount_value: 0,
    min_booking_amount: 0,
    usage_limit: 100,
    start_date: "",
    end_date: "",
  });

  const fetchVouchers = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("http://localhost:5000/api/owner/vouchers", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setVouchers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/owner/vouchers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchVouchers();
        setFormData({
          code: "",
          discount_type: "PERCENT",
          discount_value: 0,
          min_booking_amount: 0,
          usage_limit: 100,
          start_date: "",
          end_date: "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa voucher này?")) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:5000/api/owner/vouchers/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchVouchers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight mb-2">Quản lý Voucher</h2>
          <p className="text-on-surface-variant font-medium">Tạo mã giảm giá để kích cầu khách hàng đặt sân.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-all"
        >
          <span className="material-symbols-outlined">add</span> Tạo mã mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vouchers.map((v) => (
            <div key={v._id} className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-black tracking-widest uppercase">
                    {v.code}
                  </div>
                  <button onClick={() => handleDelete(v._id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
               </div>
               <div className="space-y-2">
                  <p className="text-2xl font-black text-on-surface">
                    {v.discount_type === 'PERCENT' ? `${v.discount_value}%` : `${v.discount_value.toLocaleString()}₫`}
                    <span className="text-xs font-bold text-on-surface-variant ml-2 uppercase opacity-60">Giảm giá</span>
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-on-surface-variant">
                      <span className="font-bold">Đơn tối thiểu:</span> {v.min_booking_amount.toLocaleString()}₫
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      <span className="font-bold">Đã dùng:</span> {v.used_count}/{v.usage_limit}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      <span className="font-bold">Hiệu lực:</span> {new Date(v.start_date).toLocaleDateString()} - {new Date(v.end_date).toLocaleDateString()}
                    </p>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-dashed border-outline-variant/30 flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${v.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {v.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
               </div>
            </div>
          ))}
          {vouchers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30">
               <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">confirmation_number</span>
               <p className="text-on-surface-variant font-bold text-lg">Bạn chưa có voucher nào</p>
            </div>
          )}
        </div>
      )}

      {/* Modal tạo mới */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
             <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-2xl font-black text-on-surface">Tạo Voucher Mới</h3>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
             </div>
             <form onSubmit={handleCreate} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Mã Voucher (Ví dụ: GIAM50K)</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Loại giảm giá</label>
                    <select 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.discount_type}
                      onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    >
                      <option value="PERCENT">Phần trăm (%)</option>
                      <option value="FIXED">Số tiền cố định (₫)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Giá trị giảm</label>
                    <input 
                      type="number" 
                      required 
                      min={1}
                      max={formData.discount_type === 'PERCENT' ? 100 : undefined}
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.discount_value || ""}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (formData.discount_type === 'PERCENT') {
                          if (val > 100) val = 100;
                          if (val < 0) val = 0;
                        }
                        setFormData({...formData, discount_value: val || 0});
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none text-sm"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none text-sm"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Đơn tối thiểu (₫)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.min_booking_amount || ""}
                      onChange={(e) => setFormData({...formData, min_booking_amount: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Giới hạn lượt dùng</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#f3f2ff] border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.usage_limit || ""}
                      onChange={(e) => setFormData({...formData, usage_limit: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl hover:bg-primary/90 transition-all uppercase tracking-widest">Xác nhận tạo</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
