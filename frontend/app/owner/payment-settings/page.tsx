"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [config, setConfig] = useState({
    vnpay: { tmn_code: "", hash_secret: "", is_active: false },
    momo: { partner_code: "", access_key: "", secret_key: "", is_active: false },
    payos: { client_id: "", api_key: "", checksum_key: "", is_active: false },
    banking: { bank_name: "", account_number: "", account_name: "", is_active: false },
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchConfig = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch("http://localhost:5000/api/owner/payment-config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig({
          vnpay: data.vnpay || config.vnpay,
          momo: data.momo || config.momo,
          payos: data.payos || config.payos,
          banking: data.banking || config.banking,
        });
      }
    } catch (err) {
      console.error("Fetch config error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/owner/payment-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showToast("✅ Đã cập nhật cấu hình thanh toán!", "success");
      } else {
        showToast("❌ Cập nhật thất bại.", "error");
      }
    } catch (err) {
      showToast("❌ Lỗi kết nối.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold animate-pulse">Đang tải cấu hình...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto bg-[#fbf8ff] min-h-screen">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all animate-bounce ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#003ec7]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Cài đặt Thanh toán</h1>
          <p className="text-gray-500 font-medium mt-2">Quản lý các cổng thanh toán và tài khoản ngân hàng của doanh nghiệp.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto justify-center px-8 py-4 bg-[#003ec7] text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined">save</span>}
          Lưu tất cả thay đổi
        </button>
      </header>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Banking */}
        <div className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all ${config.banking.is_active ? "border-teal-500/20 ring-4 ring-teal-500/5" : "border-transparent"}`}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Chuyển khoản (Thủ công)</h2>
                <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">Owner tự check ngân hàng</p>
              </div>
            </div>
            <div className="relative inline-flex items-center h-14">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.banking.is_active} onChange={(e) => setConfig({ ...config, banking: { ...config.banking, is_active: e.target.checked } })} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] text-gray-400 italic mb-4">Hệ thống sẽ tạo mã QR kèm STK và Số tiền cho khách. Sau khi khách chuyển, Owner phải tự kiểm tra biến động số dư và bấm xác nhận đơn hàng trên App.</p>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Ngân hàng thụ hưởng</label>
              <p className="text-[10px] text-gray-400 mb-2 italic">Chọn ngân hàng để hệ thống tạo mã VietQR chuẩn.</p>
              <select 
                value={config.banking.bank_name} 
                onChange={(e) => setConfig({ ...config, banking: { ...config.banking, bank_name: e.target.value } })} 
                className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Chọn ngân hàng --</option>
                <option value="vcb">Vietcombank (VCB)</option>
                <option value="mb">MB Bank (Quân đội)</option>
                <option value="tcb">Techcombank (TCB)</option>
                <option value="acb">ACB (Á Châu)</option>
                <option value="bidv">BIDV (Đầu tư & Phát triển)</option>
                <option value="vietinbank">Vietinbank (Công thương)</option>
                <option value="tpbank">TPBank (Tiên Phong)</option>
                <option value="vpbank">VPBank (Thịnh Vượng)</option>
                <option value="stb">Sacombank</option>
                <option value="vpb">VPBank</option>
                <option value="vccb">VietCapitalBank</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Số tài khoản</label>
                <input autoComplete="off" type="text" value={config.banking.account_number} onChange={(e) => setConfig({ ...config, banking: { ...config.banking, account_number: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-teal-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Tên chủ thẻ</label>
                <input autoComplete="off" type="text" value={config.banking.account_name} onChange={(e) => setConfig({ ...config, banking: { ...config.banking, account_name: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-teal-500 outline-none transition-all" placeholder="NGUYEN VAN A" />
              </div>
            </div>
          </div>
        </div>

        {/* PayOS */}
        <div className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all ${config.payos.is_active ? "border-orange-500/20 ring-4 ring-orange-500/5" : "border-transparent"}`}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                <span className="material-symbols-outlined text-3xl">sync_alt</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">PayOS (Tự động)</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Xác nhận đơn hàng tự động</p>
              </div>
            </div>
            <div className="relative inline-flex items-center h-14">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.payos.is_active} onChange={(e) => setConfig({ ...config, payos: { ...config.payos, is_active: e.target.checked } })} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] text-gray-400 italic mb-4">Mọi giao dịch qua PayOS sẽ được hệ thống tự động nhận diện và cập nhật trạng thái "Đã thanh toán" mà không cần Owner kiểm tra thủ công.</p>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Client ID</label>
              <input autoComplete="off" type="text" value={config.payos.client_id} onChange={(e) => setConfig({ ...config, payos: { ...config.payos, client_id: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-orange-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">API Key</label>
              <input autoComplete="new-password" type="password" value={config.payos.api_key} onChange={(e) => setConfig({ ...config, payos: { ...config.payos, api_key: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-orange-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Checksum Key</label>
              <input autoComplete="new-password" type="password" value={config.payos.checksum_key} onChange={(e) => setConfig({ ...config, payos: { ...config.payos, checksum_key: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-orange-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* VNPay */}
        <div className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all ${config.vnpay.is_active ? "border-[#003ec7]/20 ring-4 ring-[#003ec7]/5" : "border-transparent"}`}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003ec7] shrink-0">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">VNPay Gateway</h2>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Thanh toán ATM/QR</p>
              </div>
            </div>
            <div className="relative inline-flex items-center h-14">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.vnpay.is_active} onChange={(e) => setConfig({ ...config, vnpay: { ...config.vnpay, is_active: e.target.checked } })} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003ec7]"></div>
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="group">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">TMN Code</label>
              <p className="text-[10px] text-gray-400 mb-2 italic">Mã định danh Website (Terminal ID) cấp bởi VNPay.</p>
              <input autoComplete="off" type="text" value={config.vnpay.tmn_code} onChange={(e) => setConfig({ ...config, vnpay: { ...config.vnpay, tmn_code: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-[#003ec7] focus:bg-white outline-none transition-all" placeholder="Ví dụ: KINETIC01" />
            </div>
            <div className="group">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Hash Secret</label>
              <p className="text-[10px] text-gray-400 mb-2 italic">Chuỗi bí mật dùng để tạo chữ ký bảo mật giao dịch.</p>
              <input autoComplete="new-password" type="password" value={config.vnpay.hash_secret} onChange={(e) => setConfig({ ...config, vnpay: { ...config.vnpay, hash_secret: e.target.value } })} className="w-full px-5 py-4 rounded-2xl bg-[#f8f9ff] border border-gray-100 text-sm font-bold text-gray-900 focus:border-[#003ec7] focus:bg-white outline-none transition-all" placeholder="Nhập mã bí mật" />
            </div>
          </div>
        </div>

        {/* MoMo */}
        <div className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all border-transparent opacity-60 grayscale`}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                <span className="material-symbols-outlined text-3xl">wallet</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Ví MoMo</h2>
                <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">DOANH NGHIỆP/CÁ NHÂN</p>
              </div>
            </div>
            {/* Nút gạt bị khóa */}
            <div className="relative inline-flex items-center h-14">
              <div className="w-14 h-7 bg-gray-200 rounded-full cursor-not-allowed opacity-50 relative">
                <div className="absolute top-[4px] left-[4px] bg-white border-gray-300 border rounded-full h-5 w-5"></div>
              </div>
            </div>
          </div>
          <div className="space-y-4 cursor-not-allowed">
            <p className="text-[10px] font-bold text-pink-600 mb-4 bg-pink-50 p-3 rounded-xl border border-pink-100">
              Cổng thanh toán này hiện đang bảo trì hoặc chưa khả dụng cho khu vực của bạn.
            </p>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Partner Code</label>
              <input disabled type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-400 outline-none cursor-not-allowed" placeholder="..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
