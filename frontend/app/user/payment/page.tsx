"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PAYMENT_METHODS = [
  { id: "VNPAY",    label: "VNPay",    icon: "account_balance", desc: "Thanh toán qua VNPay — ATM/QR Code" },
  { id: "MOMO",     label: "MoMo",     icon: "wallet", desc: "Ví điện tử MoMo" },
  { id: "BANKING",  label: "Chuyển khoản", icon: "sync_alt", desc: "Ngân hàng nội địa / Internet Banking" },
  { id: "CASH",     label: "Tiền mặt", icon: "payments", desc: "Thanh toán tại quầy khi đến sân" },
];

const BANK_FULL_NAMES: Record<string, string> = {
  "mb": "Ngân hàng TMCP Quân đội (MB)",
  "vcb": "Ngân hàng TMCP Ngoại thương (Vietcombank)",
  "vietcombank": "Ngân hàng TMCP Ngoại thương (Vietcombank)",
  "tcb": "Ngân hàng TMCP Kỹ thương (Techcombank)",
  "techcombank": "Ngân hàng TMCP Kỹ thương (Techcombank)",
  "vbi": "Ngân hàng TMCP Công thương (VietinBank)",
  "vietinbank": "Ngân hàng TMCP Công thương (VietinBank)",
  "bidv": "Ngân hàng TMCP Đầu tư và Phát triển VN (BIDV)",
  "acb": "Ngân hàng TMCP Á Châu (ACB)",
  "vp": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
  "vpbank": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
  "stb": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
  "sacombank": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
  "hdb": "Ngân hàng TMCP Phát triển TP.HCM (HDBank)",
  "shb": "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)",
  "tp": "Ngân hàng TMCP Tiên Phong (TPBank)",
  "tpbank": "Ngân hàng TMCP Tiên Phong (TPBank)",
  "vab": "Ngân hàng TMCP Việt Á",
  "agribank": "Ngân hàng Nông nghiệp & Phát triển Nông thôn",
  "msb": "Ngân hàng TMCP Hàng Hải Việt Nam",
  "ocb": "Ngân hàng TMCP Phương Đông",
  "vib": "Ngân hàng TMCP Quốc tế Việt Nam",
};

const getBankDisplayName = (name: string) => {
  if (!name) return "N/A";
  const lower = name.toLowerCase().replace(/bank/g, '').trim();
  return BANK_FULL_NAMES[lower] || name.toUpperCase();
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = Number(searchParams.get("amount") ?? 0);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("CASH");
  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState<"select" | "processing" | "success" | "failed">("select");
  const [countdown, setCountdown] = useState(5);
  const [backCount, setBackCount] = useState(0);

  // Chặn nút Back khi đang xử lý hoặc thành công
  useEffect(() => {
    if (step !== "select") {
      // Đẩy thêm 1 state vào history để "bẫy" nút back
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        // Nếu người dùng ấn back, lại đẩy họ quay lại trang hiện tại
        window.history.pushState(null, "", window.location.href);
        
        setBackCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // Nếu spam quá 3 lần -> Đẩy về trang chủ của trình duyệt hoặc web
            window.location.href = "/";
          }
          return newCount;
        });
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [step]);

  useEffect(() => {
    if (!bookingId || bookingId === "undefined") { 
      router.push("/fields"); 
      return; 
    }
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    // Fetch booking
    fetch(`http://localhost:5000/api/users/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { 
        if (d) {
          // Nếu đơn đã thanh toán hoặc đã xác nhận thành công
          if (d.status === 'CONFIRMED' || d.status === 'COMPLETED' || d.payment_status === 'PAID') {
            router.push(`/user/booking-confirmation?bookingId=${bookingId}`);
            return;
          }
          // Nếu đơn đang chờ chủ sân duyệt (Chuyển khoản thủ công)
          if (d.status === 'PENDING' && d.payment_method === 'BANKING') {
            router.push(`/user/waiting-confirmation?bookingId=${bookingId}`);
            return;
          }
          setBooking(d); 
        }
      });

    // Fetch available methods
    fetch(`http://localhost:5000/api/payments/methods/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(methods => {
        if (Array.isArray(methods)) {
          setAvailableMethods(methods);
          const active = methods.find((m: any) => m.is_active);
          if (active) setSelectedMethod(active.id);
        } else {
          console.error("Invalid methods data:", methods);
          setAvailableMethods([{ id: 'CASH', label: 'Tiền mặt', is_active: true, icon: 'payments', desc: 'Thanh toán tại sân' }]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId, router]);

  // Auto-redirect after success
  useEffect(() => {
    if (step !== "success") return;
    const timer = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Polling check for automated payments (VNPay/PayOS)
  useEffect(() => {
    if (step !== "success") return;
    
    // Nếu là Tiền mặt thì cứ đếm ngược rồi đi tiếp
    if (selectedMethod === 'CASH') return;

    // Nếu là Online, cứ 2s check xem đã PAID chưa
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      fetch(`http://localhost:5000/api/users/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(d => {
          if (d.payment_status === 'PAID') {
            router.push(`/user/booking-confirmation?bookingId=${bookingId}`);
          }
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [step, bookingId, router, selectedMethod]);

  useEffect(() => {
    if (step === "success" && countdown <= 0) {
        // Hết 5s, nếu là tiền mặt thì auto đi tiếp
        if (selectedMethod === 'CASH') {
            router.push(`/user/booking-confirmation?bookingId=${bookingId}`);
        } else {
            // Nếu là online mà vẫn chưa thấy tiền thì có thể báo lỗi hoặc cho user chờ thêm
            // Ở đây mình cứ để user ở lại trang success hoặc về lịch sử
            // router.push("/user/history"); 
        }
    }
  }, [step, countdown, router, bookingId, selectedMethod]);

  const handlePay = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const method = availableMethods.find(m => m.id === selectedMethod);
    if (method && !method.is_active && method.id !== 'CASH') {
      alert("Doanh nghiệp chưa liên kết nền tảng này.");
      return;
    }

    setPaying(true);
    setStep("processing");

    try {
      if (selectedMethod === "VNPAY") {
        const res = await fetch(`http://localhost:5000/api/payments/create-vnpay-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ booking_id: bookingId }),
        });
        const data = await res.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        } else {
          setStep("failed");
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ method: selectedMethod }),
        });

        if (res.ok) {
          if (selectedMethod === 'BANKING') {
            router.push(`/user/waiting-confirmation?bookingId=${bookingId}`);
          } else {
            setStep("success");
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          alert("Lỗi: " + (errData.message || "Giao dịch không thành công"));
          setStep("failed");
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert("Lỗi kết nối: " + error.message);
      setStep("failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8ff]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Success screen
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="material-symbols-outlined text-5xl text-yellow-600" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Giao dịch đang chờ xác nhận
          </h1>
          <p className="text-gray-500 mb-2">
            Hệ thống đang kiểm tra trạng thái thanh toán của bạn. Vui lòng chờ trong giây lát.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-600 font-bold mb-8">
            <div className="w-4 h-4 border-2 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
            Đang chuẩn bị thông tin lịch đặt... {countdown}s
          </div>

          <div className="bg-white rounded-2xl p-6 text-left mb-6 shadow-sm border border-gray-100">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Phương thức</span>
              <span className="font-bold">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-bold text-primary">{amount.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Trạng thái</span>
              <span className="text-yellow-600 font-black uppercase text-xs tracking-widest">Đang xử lý</span>
            </div>
          </div>

          <Link href="/user/history" className="w-full bg-primary text-white py-4 rounded-full font-black block hover:shadow-lg transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Xem lịch sử đặt sân
          </Link>
        </div>
      </div>
    );
  }

  // Processing screen
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-full h-full border-4 border-primary/20 rounded-full" />
            <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Đang xử lý thanh toán...
          </h2>
          <p className="text-gray-500">Vui lòng không đóng trang này</p>
        </div>
      </div>
    );
  }

  // Failed screen
  if (step === "failed") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Thanh toán thất bại</h1>
          <p className="text-gray-500 mb-8">Giao dịch không thể hoàn tất. Vui lòng thử lại.</p>
          <div className="flex gap-4">
            <button onClick={() => setStep("select")} className="flex-1 bg-primary text-white py-4 rounded-full font-black hover:shadow-lg transition-all">
              Thử lại
            </button>
            <button 
              onClick={async () => {
                const token = localStorage.getItem("access_token");
                await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/cancel`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ cancel_reason: "User cancelled during payment" }),
                });
                router.push("/fields");
              }}
              className="flex-1 border border-gray-200 py-4 rounded-full font-black text-gray-700 hover:bg-gray-50 transition-all"
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main payment screen
  return (
    <div className="min-h-screen bg-[#fbf8ff]">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
        <button 
          onClick={async () => {
            const token = localStorage.getItem("access_token");
            if (token && bookingId && bookingId !== "undefined") {
              await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ cancel_reason: "User backed out from payment" })
              });
            }
            router.push("/fields");
          }} 
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Thanh toán</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <span className="material-symbols-outlined text-green-500 text-[18px]">lock</span>
          Bảo mật SSL
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8 pb-24">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
            Thông tin đặt sân
          </h2>
          {booking ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sân</span>
                <span className="font-bold text-gray-900">{booking.court_id?.name ?? "Sân thể thao"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày</span>
                <span className="font-bold">{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian</span>
                <span className="font-bold">{booking.start_time} – {booking.end_time}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-black text-gray-900 text-base">Tổng tiền</span>
                <span className="font-black text-primary text-xl">{(booking.total_price ?? amount).toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-500">Tổng tiền</span>
              <span className="font-black text-primary text-xl">{amount.toLocaleString("vi-VN")} ₫</span>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            <span className="material-symbols-outlined text-primary text-[20px]">payment</span>
            Chọn phương thức thanh toán
          </h2>
          <div className="flex flex-col gap-3">
            {availableMethods.map(m => {
              const isActive = m.is_active || m.id === 'CASH';
              return (
                <button
                  key={m.id}
                  onClick={() => isActive && setSelectedMethod(m.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedMethod === m.id ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-primary/30"
                  } ${!isActive ? "opacity-50 grayscale" : ""}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedMethod === m.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                    <span className="material-symbols-outlined text-2xl">{m.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">
                      {isActive ? m.desc : "Doanh nghiệp chưa liên kết nền tảng này"}
                    </p>
                  </div>
                  {selectedMethod === m.id && (
                    <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bank info for BANKING */}
        {selectedMethod === "BANKING" && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
            <h3 className="font-black text-blue-900 mb-3 text-sm flex items-center justify-between">
              Thông tin chuyển khoản
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">VietQR</span>
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-100 shrink-0">
                {(() => {
                  const bankInfo = availableMethods.find(m => m.id === 'BANKING')?.info;
                  if (!bankInfo) return null;
                  
                  // Chuẩn hóa mã ngân hàng cho VietQR (VD: MBBank -> mb, Techcombank -> tcb)
                  const getVietQRBankId = (name: string) => {
                    const n = name.toLowerCase().replace(/bank/g, '').trim();
                    if (n.includes('quân đội') || n === 'm' || n === 'mb') return 'mb';
                    if (n.includes('ngoại thương') || n === 'vcb') return 'vcb';
                    if (n.includes('kỹ thương') || n === 'tcb') return 'tcb';
                    if (n.includes('công thương') || n === 'vbi' || n === 'vietin') return 'vietinbank';
                    if (n.includes('đầu tư') || n === 'bidv') return 'bidv';
                    if (n.includes('á châu') || n === 'acb') return 'acb';
                    if (n.includes('thịnh vượng') || n === 'vp') return 'vpbank';
                    if (n.includes('sài gòn thương tín') || n === 'stb' || n === 'sacom') return 'sacombank';
                    if (n.includes('tiên phong') || n === 'tp') return 'tpbank';
                    return n;
                  };

                  const bankId = getVietQRBankId(bankInfo.bank_name || 'vcb');
                  const qrUrl = `https://img.vietqr.io/image/${bankId}-${bankInfo.account_number}-compact2.jpg?amount=${amount}&addInfo=KINETIC%20${bookingId?.slice(-6).toUpperCase()}&accountName=${encodeURIComponent(bankInfo.account_name)}`;
                  
                  return (
                    <img 
                      src={qrUrl}
                      alt="VietQR Payment"
                      className="w-40 h-40 object-contain"
                    />
                  );
                })()}
              </div>

              <div className="flex-grow space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-blue-700">Ngân hàng</span><span className="font-bold text-blue-900">{getBankDisplayName(availableMethods.find(m => m.id === 'BANKING')?.info?.bank_name)}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">STK</span><span className="font-bold font-mono text-blue-900">{availableMethods.find(m => m.id === 'BANKING')?.info?.account_number || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Chủ TK</span><span className="font-bold text-blue-900">{availableMethods.find(m => m.id === 'BANKING')?.info?.account_name || 'N/A'}</span></div>
                <div className="flex justify-between pt-2 border-t border-blue-100"><span className="text-blue-700">Nội dung</span><span className="font-bold font-mono text-blue-900">KINETIC {bookingId?.slice(-6).toUpperCase()}</span></div>
              </div>
            </div>
            
            <p className="text-[11px] text-blue-600 mt-4 italic text-center">
              * Quét mã QR bằng ứng dụng ngân hàng để tự động điền thông tin.
            </p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full bg-gradient-to-r from-[#003ec7] to-[#0052ff] text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          <span className="material-symbols-outlined text-[22px]">lock</span>
          Thanh toán {amount > 0 ? amount.toLocaleString("vi-VN") + " ₫" : "ngay"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Thông tin thanh toán được mã hóa bảo mật 256-bit SSL
        </p>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
