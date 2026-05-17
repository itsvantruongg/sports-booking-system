"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xác nhận" },
  CONFIRMED: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã xác nhận" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
};

function BookingCard({ 
  booking, 
  style, 
  actionLoading, 
  confirmPayment, 
  updateStatus 
}: { 
  booking: any; 
  style: any; 
  actionLoading: string | null; 
  confirmPayment: (id: string) => void; 
  updateStatus: (id: string, status: "CONFIRMED" | "CANCELLED") => void; 
}) {
  const isPending = booking.status === "PENDING";
  return (
    <div className={`bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(25,27,37,0.1)] ${isPending ? "border-l-4 border-yellow-400" : ""}`}>
      <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Info */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black ${style.bg} ${style.text}`}>{style.label}</span>
            {isPending && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 animate-pulse">
                ⏳ Cần xử lý
              </span>
            )}
          </div>
          <h3 className="text-xl font-display font-black text-on-surface mb-1">
            {booking.court_id?.name || "Sân thể thao"}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mt-2">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              {booking.user_id?.name || "Khách hàng"}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              {new Date(booking.booking_date).toLocaleDateString("vi-VN")}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              {booking.start_time} – {booking.end_time}
            </span>
            <span className="flex items-center gap-1 font-bold text-primary">
              <span className="material-symbols-outlined text-[16px]">payments</span>
              {booking.total_price?.toLocaleString("vi-VN")} ₫
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              {booking.payment_method === 'CASH' ? '💵 Tiền mặt' : '💳 Chuyển khoản'}
              <span className={`w-1.5 h-1.5 rounded-full ${booking.payment_status === 'PAID' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
              {booking.payment_status === 'PAID' ? 'Đã trả' : 'Treo nợ'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-on-surface-variant">
            <span className="font-bold text-primary font-mono text-[13px] bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
              Mã đơn: #{booking._id.slice(-6).toUpperCase()}
            </span>
            <span className="font-mono opacity-50">
              ID: {booking._id}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 shrink-0 w-full md:w-auto">
          {booking.payment_status === 'PENDING' && (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && (
            <button
              onClick={() => confirmPayment(booking._id)}
              disabled={!!actionLoading}
              className="px-5 py-2.5 rounded-full bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-2 justify-center"
            >
              {actionLoading === booking._id + "PAY" ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              Xác nhận thanh toán
            </button>
          )}
          {isPending && (
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(booking._id, "CANCELLED")}
                disabled={!!actionLoading}
                className="flex-1 px-5 py-2.5 rounded-full border-2 border-error/40 text-error font-bold text-sm hover:bg-error/5 transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
              >
                {actionLoading === booking._id + "CANCELLED"
                  ? <span className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                  : <span className="material-symbols-outlined text-[16px]">close</span>
                }
                Từ chối
              </button>
              <button
                onClick={() => updateStatus(booking._id, "CONFIRMED")}
                disabled={!!actionLoading}
                className="flex-1 px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
              >
                {actionLoading === booking._id + "CONFIRMED"
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <span className="material-symbols-outlined text-[16px]">check</span>
                }
                Xác nhận
              </button>
            </div>
          )}
          {booking.status === "CONFIRMED" && (
            <button
              onClick={() => updateStatus(booking._id, "CANCELLED")}
              disabled={!!actionLoading}
              className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-low transition-all disabled:opacity-50"
            >
              Hủy đặt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OwnerBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("PENDING");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/owner/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch { console.error("Fetch bookings error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (bookingId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setActionLoading(bookingId + newStatus);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/owner/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        showToast(newStatus === "CONFIRMED" ? "✅ Đã xác nhận đặt sân!" : "❌ Đã từ chối đặt sân.", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Thao tác thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setActionLoading(null); }
  };

  const confirmPayment = async (bookingId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    if (!confirm("Xác nhận khách đã thanh toán đơn này?")) return;

    setActionLoading(bookingId + "PAY");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/owner/bookings/${bookingId}/confirm-payment`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, payment_status: 'PAID' } : b));
        showToast("💰 Đã xác nhận thanh toán!", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Thao tác thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setActionLoading(null); }
  };

  const tabs = [
    { key: "PENDING", label: "Chờ xác nhận", icon: "pending" },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: "check_circle" },
    { key: "COMPLETED", label: "Hoàn thành", icon: "sports_score" },
    { key: "CANCELLED", label: "Đã hủy", icon: "cancel" },
  ] as const;

  // Filter bookings locally by ID (both full and short form) or names
  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    const cleanQuery = searchQuery.trim().toLowerCase().replace("#", "");
    const bookingId = booking._id.toLowerCase();
    const shortId = booking._id.slice(-6).toLowerCase();
    const customerName = (booking.user_id?.name || "").toLowerCase();
    const courtName = (booking.court_id?.name || "").toLowerCase();
    return bookingId.includes(cleanQuery) || shortId.includes(cleanQuery) || customerName.includes(cleanQuery) || courtName.includes(cleanQuery);
  });

  // Group results for searching
  const groupedResults = {
    PENDING: filteredBookings.filter(b => b.status === "PENDING"),
    CONFIRMED: filteredBookings.filter(b => b.status === "CONFIRMED"),
    COMPLETED: filteredBookings.filter(b => b.status === "COMPLETED"),
    CANCELLED: filteredBookings.filter(b => b.status === "CANCELLED"),
  };

  return (
    <div className="p-6 lg:p-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface">Quản lý Đặt Sân</h1>
          <p className="text-on-surface-variant font-body mt-2">Xem và xử lý các yêu cầu đặt sân từ khách hàng.</p>
        </div>
      </header>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-stretch sm:items-center">
        {/* Search input with modern styling */}
        <div className="flex-grow max-w-md flex items-center gap-3 bg-surface-container-low rounded-full px-5 py-2.5 border border-outline-variant/10 focus-within:border-primary/30 focus-within:bg-surface-bright transition-all shadow-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 flex-grow font-body outline-none text-sm" 
            placeholder="Tìm theo Mã đơn (VD: #3B72BE), tên khách, sân..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-on-surface-variant/60 hover:text-on-surface flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Refresh button */}
        <button 
          onClick={fetchBookings} 
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-surface-container-low text-on-surface font-bold text-sm hover:bg-surface-container transition-colors border border-outline-variant/10 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span> Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {tabs.map(tab => {
          const count = searchQuery 
            ? groupedResults[tab.key].length 
            : bookings.filter(b => b.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (searchQuery) {
                  // If they click on a tab while searching, clear the search so they can see the tab's full content!
                  setSearchQuery("");
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key && !searchQuery
                  ? "bg-primary text-on-primary shadow-md" 
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
              {count > 0 && (
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ml-1 ${
                  activeTab === tab.key && !searchQuery ? "bg-on-primary text-primary" : "bg-primary/10 text-primary"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-surface-container rounded w-1/3 mb-3" />
              <div className="h-3 bg-surface-container rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        // Search Results Mode across ALL tabs / statuses
        filteredBookings.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">search_off</span>
            <p className="text-on-surface-variant font-body text-lg font-bold">Không tìm thấy đơn đặt sân nào</p>
            <p className="text-on-surface-variant/70 text-sm mt-1">Hãy thử tìm với từ khóa khác hoặc mã đơn khác</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {tabs.map(tab => {
              const tabBookings = groupedResults[tab.key];
              if (tabBookings.length === 0) return null;
              return (
                <div key={tab.key} className="flex flex-col gap-4 bg-surface-container-low/20 p-6 rounded-3xl border border-outline-variant/10">
                  {/* Status Group Header */}
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">{tab.icon}</span>
                    <h2 className="text-lg font-display font-black text-on-surface">{tab.label}</h2>
                    <span className="bg-primary/10 text-primary text-xs font-black px-2.5 py-0.5 rounded-full">
                      {tabBookings.length} đơn tìm thấy
                    </span>
                  </div>

                  {/* Booking list in this status */}
                  <div className="flex flex-col gap-4">
                    {tabBookings.map(booking => (
                      <BookingCard 
                        key={booking._id} 
                        booking={booking} 
                        style={STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING}
                        actionLoading={actionLoading}
                        confirmPayment={confirmPayment}
                        updateStatus={updateStatus}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // Normal Mode (filtered by activeTab)
        (() => {
          const tabBookings = bookings.filter(b => b.status === activeTab);
          return tabBookings.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4 block">inbox</span>
              <p className="text-on-surface-variant font-body text-lg">Không có đơn nào ở trạng thái này.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tabBookings.map(booking => (
                <BookingCard 
                  key={booking._id} 
                  booking={booking} 
                  style={STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING}
                  actionLoading={actionLoading}
                  confirmPayment={confirmPayment}
                  updateStatus={updateStatus}
                />
              ))}
            </div>
          );
        })()
      )}
      <div className="h-16" />
    </div>
  );
}