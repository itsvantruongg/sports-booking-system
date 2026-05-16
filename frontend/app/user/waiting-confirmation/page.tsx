"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function WaitingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<any>(null);
  const [backCount, setBackCount] = useState(0);

  // Chặn nút Back khi đang ở trang chờ xác nhận
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setBackCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) window.location.replace("/");
        return newCount;
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    const token = localStorage.getItem("access_token");
    
    // Fetch chi tiết đơn để hiển thị
    fetch(`http://localhost:5000/api/users/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setBooking(d));

    // Polling nhẹ: Cứ 10s kiểm tra xem Owner đã duyệt chưa
    const interval = setInterval(() => {
        fetch(`http://localhost:5000/api/users/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(r => r.json())
            .then(d => {
                if (d.status === 'CONFIRMED') {
                    router.push(`/user/booking-confirmation?bookingId=${bookingId}`);
                }
            });
    }, 10000);

    return () => clearInterval(interval);
  }, [bookingId, router]);

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-blue-600 animate-bounce">mark_email_read</span>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Đã gửi yêu cầu xác nhận
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Chúng tôi đã gửi thông báo chuyển khoản của bạn tới chủ sân. <br />
          Vui lòng chờ trong giây lát để chủ sân kiểm tra và duyệt đơn.
        </p>

        {booking && (
          <div className="bg-white rounded-3xl p-6 text-left mb-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Chi tiết giao dịch</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-mono font-bold text-gray-900">#{booking._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Số tiền</span>
                    <span className="font-bold text-primary">{booking.total_price.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="px-3 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase">Chờ chủ sân duyệt</span>
                </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
            <Link href="/user/history" className="w-full bg-primary text-white py-4 rounded-full font-black hover:shadow-lg transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Về trang lịch sử đặt sân
            </Link>
            <p className="text-xs text-gray-400 italic">
                Hệ thống sẽ tự động chuyển trang khi chủ sân nhấn xác nhận.
            </p>
        </div>
      </div>
    </div>
  );
}

export default function WaitingForOwnerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WaitingContent />
    </Suspense>
  );
}
