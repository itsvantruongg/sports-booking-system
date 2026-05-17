"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PAYMENT_METHODS = [
  { id: 'CASH', label: 'Thanh toán tại sân', is_active: true, icon: 'payments', desc: 'Thanh toán bằng tiền mặt khi đến nhận sân' },
  { id: 'BANKING', label: 'Chuyển khoản (Thủ công)', is_active: true, icon: 'account_balance', desc: 'Chuyển khoản và chờ chủ sân xác nhận' },
  { id: 'VNPAY', label: 'VNPay (Tự động)', is_active: true, icon: 'account_balance_wallet', desc: 'Thanh toán online qua cổng VNPay' },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");
  const amountStr = searchParams?.get("amount");
  const amount = parseInt(amountStr || "0");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("CASH");
  const [paying, setPaying] = useState(false);
  
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  
  // Voucher State
  const [voucherCode, setVoucherCode] = useState("");
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const [step, setStep] = useState<"select" | "processing" | "success" | "failed" | "vietqr">("select");
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút

  useEffect(() => {
    if (!bookingId || bookingId === "undefined") { 
      router.push("/fields"); 
      return; 
    }
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    fetchBooking(token);
    fetchMyVouchers(token);

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
          setAvailableMethods([{ id: 'CASH', label: 'Tiền mặt', is_active: true, icon: 'payments', desc: 'Thanh toán tại sân' }]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId, router]);

  useEffect(() => {
    if (!booking || !booking.expires_at || step !== "select") return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(booking.expires_at).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        alert("Đã hết thời gian giữ chỗ! Đơn đặt sân của bạn đã bị hủy.");
        router.push("/fields");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, step, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const fetchMyVouchers = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/vouchers/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyVouchers(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchBooking = async (token: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.status === 'CONFIRMED' || d.status === 'COMPLETED' || d.payment_status === 'PAID') {
          router.push(`/user/booking-confirmation?bookingId=${bookingId}`);
          return;
        }
        setBooking(d);
      }
    } catch (err) { console.error(err); }
  };

  const handleApplyVoucher = async (codeOverride?: string) => {
    const codeToUse = codeOverride || voucherCode;
    if (!codeToUse) return;
    setApplyingVoucher(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/apply-voucher`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ voucher_code: codeToUse })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Áp dụng mã giảm giá thành công!");
        setBooking(data.booking);
        setVoucherCode("");
      } else {
        alert(data.message || "Không thể áp dụng mã này");
      }
    } catch (err) { alert("Lỗi kết nối"); }
    finally { setApplyingVoucher(false); }
  };

  const handlePay = async () => {
    if (selectedMethod === 'BANKING') {
      setStep("vietqr");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

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
          setStep("success");
        } else {
          setStep("failed");
        }
      }
    } catch (error) {
      setStep("failed");
    } finally {
      setPaying(false);
    }
  };

  const handleConfirmBanking = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setPaying(true);
    setStep("processing");

    try {
      const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ method: "BANKING" }),
      });

      if (res.ok) {
        router.push(`/user/waiting-confirmation?bookingId=${bookingId}`);
      } else {
        setStep("failed");
      }
    } catch (error) {
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

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Thanh toán hoàn tất</h1>
          <p className="text-gray-500 mb-8">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          <Link href={`/user/booking-confirmation?bookingId=${bookingId}`} className="w-full bg-primary text-white py-4 rounded-full font-black block">
            Xem chi tiết đặt sân
          </Link>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-red-600">cancel</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Thanh toán thất bại</h1>
          <button onClick={() => setStep("select")} className="w-full bg-primary text-white py-4 rounded-full font-black">Thử lại</button>
        </div>
      </div>
    );
  }

  if (step === "vietqr") {
    const amountToPay = booking?.total_price ?? amount;
    return (
      <div className="min-h-screen bg-[#fbf8ff] py-12 px-4">
        <div className="max-w-md mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <button onClick={() => setStep("select")} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50">
              <span className="material-symbols-outlined text-gray-700">arrow_back</span>
            </button>
            <h1 className="text-2xl font-black text-gray-900">Thanh toán chuyển khoản</h1>
          </header>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Quét mã QR để thanh toán</h2>
            <p className="text-sm text-gray-500 mb-6">Sử dụng ứng dụng ngân hàng để quét mã</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl inline-block mb-6">
              <img 
                src={`https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${amountToPay}&addInfo=${bookingId?.slice(-8)}&accountName=KINETIC_SPORTS`} 
                alt="VietQR" 
                className="w-64 h-64 object-contain rounded-xl"
              />
            </div>

            <div className="space-y-4 text-left bg-gray-50 p-5 rounded-2xl">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Ngân hàng</span>
                <span className="font-bold text-gray-900 text-sm">MB Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Chủ tài khoản</span>
                <span className="font-bold text-gray-900 text-sm">KINETIC SPORTS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Số tài khoản</span>
                <span className="font-bold text-gray-900 text-sm font-mono tracking-wider">0123456789</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-500 text-sm">Số tiền</span>
                <span className="font-black text-primary text-lg">{amountToPay.toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Nội dung</span>
                <span className="font-mono text-gray-900 text-sm font-bold bg-white px-2 py-1 rounded">{bookingId?.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setStep("select")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-black"
            >
              Hủy
            </button>
            <button 
              onClick={handleConfirmBanking}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20"
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8ff]">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/fields")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-gray-900">Thanh toán</h1>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-black text-sm">
          <span className="material-symbols-outlined text-[18px]">timer</span>
          {formatTime(timeLeft)}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8 pb-24">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
            Thông tin đơn hàng
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Sân</span>
              <span className="font-bold">{booking?.court_id?.name ?? "Sân thể thao"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày</span>
              <span className="font-bold">{booking ? new Date(booking.booking_date).toLocaleDateString("vi-VN") : ""}</span>
            </div>
            {booking?.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Giảm giá ({booking.voucher_code})</span>
                <span className="font-bold">-{booking.discount_amount.toLocaleString()} ₫</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-black text-gray-900 text-base">Tổng tiền</span>
              <span className="font-black text-primary text-xl">{(booking?.total_price ?? amount).toLocaleString()} ₫</span>
            </div>
          </div>
        </div>

        {/* Voucher Selection from Wallet */}
        {myVouchers.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                Voucher của bạn
              </h2>
              {booking?.voucher_code && (
                <button 
                  onClick={() => handleApplyVoucher("")}
                  disabled={applyingVoucher}
                  className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                >
                  Gỡ mã giảm giá
                </button>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {myVouchers.map((v) => {
                const isApplied = booking?.voucher_code === v.code;
                return (
                  <button
                    key={v._id}
                    onClick={() => !isApplied ? handleApplyVoucher(v.code) : handleApplyVoucher("")}
                    disabled={applyingVoucher}
                    className={`shrink-0 border-2 p-4 rounded-2xl text-left transition-all min-w-[200px] relative overflow-hidden ${
                      isApplied 
                        ? 'bg-primary border-primary shadow-lg scale-105 mx-2' 
                        : 'bg-primary/5 border-primary/10 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${isApplied ? 'text-white' : 'text-primary'}`}>sell</span>
                        <span className={`font-black uppercase text-sm tracking-wider ${isApplied ? 'text-white' : 'text-primary'}`}>{v.code}</span>
                      </div>
                      {isApplied && <span className="material-symbols-outlined text-white text-[16px]">check_circle</span>}
                    </div>
                    <p className={`font-black ${isApplied ? 'text-white' : 'text-gray-900'}`}>
                      {v.discount_type === 'PERCENT' ? `Giảm ${v.discount_value}%` : `Giảm ${v.discount_value.toLocaleString()} ₫`}
                    </p>
                    <p className={`text-[10px] font-bold mt-1 ${isApplied ? 'text-white/80' : 'text-gray-500'}`}>
                      Đơn tối thiểu: {v.min_booking_amount?.toLocaleString()} ₫
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Voucher Manual Input */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">sell</span>
            Nhập mã khác
          </h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Nhập mã voucher..." 
              className="flex-1 bg-gray-50 px-4 py-3 rounded-xl border-none font-bold outline-none uppercase"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button 
              onClick={() => handleApplyVoucher()}
              disabled={applyingVoucher || !voucherCode}
              className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-black hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            >
              {applyingVoucher ? "Đang xử lý..." : "Áp dụng"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
            Phương thức thanh toán
          </h2>
          <div className="space-y-4">
            {availableMethods.map((method) => (
              <label key={method.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === method.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name="payment" value={method.id} checked={selectedMethod === method.id} onChange={() => setSelectedMethod(method.id)} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-gray-400">{method.icon}</span>
                    <span className="font-bold text-gray-900">{method.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handlePay} disabled={paying} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
          {paying ? "Đang xử lý..." : "Thanh toán ngay"}
        </button>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
