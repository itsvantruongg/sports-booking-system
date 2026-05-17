"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Venue {
  _id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  status: string;
}

export default function OwnerPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ 
    total_revenue: 0, 
    total_platform_fee: 0,
    net_revenue: 0,
    digital_revenue: 0, 
    cash_revenue: 0, 
    debt: 0, 
    commission_debt: 0,
    booking_count: 0 
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { "Authorization": `Bearer ${token}` };

      try {
        // Fetch stats, venues, bookings... (giữ nguyên logic cũ)
        const [statsRes, venuesRes, bookingsRes, notifsRes] = await Promise.all([
          fetch("http://localhost:5000/api/owner/dashboard?range=today", { headers }),
          fetch("http://localhost:5000/api/owner/venues", { headers }),
          fetch("http://localhost:5000/api/owner/bookings?limit=5", { headers }),
          fetch("http://localhost:5000/api/notifications", { headers })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (venuesRes.ok) setVenues(await venuesRes.json());
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setRecentBookings((Array.isArray(data) ? data : data.data ?? []).slice(0, 5));
        }
        if (notifsRes.ok) {
          const notifs = await notifsRes.json();
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
        }

      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Polling thông báo mỗi 10s (Thay thế cho Socket.io khi không cài được lib)
    const interval = setInterval(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.is_read).length);
        }
      } catch (e) {}
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const markAllRead = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  if (loading) {
    return <div className="p-8 lg:p-12 h-screen flex justify-center items-center">Đang tải dữ liệu...</div>;
  }

  // Logic lời chào theo thời gian thực
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <header className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-60">{currentDate}</p>
          <div className="flex gap-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${showNotifPanel ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-low text-primary hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>
                  notifications
                </span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel - Giữ nguyên logic cũ nhưng có thể cần chỉnh lại right-0 */}
              {showNotifPanel && (
                <div className="absolute right-[-48px] sm:right-0 mt-4 w-[calc(100vw-32px)] sm:w-[400px] bg-white border border-outline-variant/30 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                  <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
                    <h3 className="font-black text-on-surface text-base">Thông báo mới</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Đánh dấu đã đọc</button>
                    )}
                  </div>
                  <div className="max-h-[450px] overflow-y-auto no-scrollbar bg-white">
                    {notifications.length === 0 ? (
                      <div className="p-16 text-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant/30 mb-3">notifications_off</span>
                        <p className="text-sm font-bold text-on-surface-variant">Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n._id} className={`p-6 border-b border-outline-variant/5 flex gap-4 transition-colors ${!n.is_read ? 'bg-primary/5' : 'hover:bg-surface-container-lowest'}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${!n.is_read ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined text-xl">
                              {n.type?.includes('CASH') ? 'payments' : 'book_online'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-sm leading-tight pr-2 ${!n.is_read ? 'font-black text-on-surface' : 'font-bold text-on-surface-variant'}`}>{n.title}</p>
                              <p className="text-[10px] font-bold text-outline uppercase whitespace-nowrap">
                                {new Date(n.created_at || n.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className={`text-xs leading-relaxed line-clamp-2 ${!n.is_read ? 'text-on-surface' : 'text-on-surface-variant opacity-80'}`}>{n.body}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/owner/bookings" className="block p-5 text-center text-xs font-black text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/10 bg-surface-container-lowest uppercase tracking-widest">
                    Xem tất cả đơn hàng
                  </Link>
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white">A</div>
          </div>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-on-surface max-w-2xl leading-[1.1]">
          {getGreeting()}, <br />
          <span className="text-primary">Quản trị viên</span>
        </h2>
      </header>

      {/* Quick Stats Bento Grid - 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-b-4 border-primary relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-primary">analytics</span>
          </div>
          <h3 className="text-on-surface-variant font-bold mb-2 text-[10px] uppercase tracking-widest">Doanh thu gộp</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-on-surface">{(stats.total_revenue || 0).toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-on-surface-variant">₫</span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">Chưa trừ phí sàn</p>
        </div>

        {/* Card 2: Phí sàn (5%) */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-b-4 border-red-400 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-red-400">percent</span>
          </div>
          <h3 className="text-on-surface-variant font-bold mb-2 text-[10px] uppercase tracking-widest">Phí sàn (5%)</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-red-600">{(stats.total_platform_fee || 0).toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-red-500">₫</span>
          </div>
        </div>

        {/* Card 3: Doanh thu thực nhận */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-b-4 border-green-600 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-green-600">account_balance_wallet</span>
          </div>
          <h3 className="text-on-surface-variant font-bold mb-2 text-[10px] uppercase tracking-widest">Thực nhận</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-green-700">{(stats.net_revenue || 0).toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-green-600">₫</span>
          </div>
        </div>

        {/* Card 4: Nợ Admin */}
        <div className="bg-[#fff4f4] p-5 rounded-2xl shadow-sm border-b-4 border-red-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-red-500">error</span>
          </div>
          <h3 className="text-red-800 font-bold mb-2 text-[10px] uppercase tracking-widest">Nợ hoa hồng</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-red-700">{(stats.commission_debt || 0).toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-red-600">₫</span>
          </div>
          <p className="text-[10px] text-red-600 mt-1">Cần trả Admin</p>
        </div>

        {/* Card 5: Khách nợ */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-b-4 border-yellow-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-yellow-500">pending_actions</span>
          </div>
          <h3 className="text-on-surface-variant font-bold mb-2 text-[10px] uppercase tracking-widest">Khách nợ</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-yellow-700">{(stats.debt || 0).toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-yellow-600">₫</span>
          </div>
        </div>

        {/* Card 6: Đơn đặt hôm nay */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-b-4 border-purple-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl text-purple-500">confirmation_number</span>
          </div>
          <h3 className="text-on-surface-variant font-bold mb-2 text-[10px] uppercase tracking-widest">Lượt đặt hôm nay</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-on-surface">{stats.booking_count || 0}</span>
            <span className="text-xs font-bold text-on-surface-variant">Đơn</span>
          </div>
        </div>
      </div>
      {/* Asymmetric Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Recent Bookings */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Đơn hàng gần đây</h3>
            <Link href="/owner/bookings" className="text-primary font-headline font-semibold text-sm hover:underline">Xem tất cả</Link>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden">
            {recentBookings.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">Chưa có lượt đặt sân nào.</div>
            ) : (
              <div className="flex flex-col divide-y divide-surface-container-low">
                {recentBookings.map((booking: any) => {
                  const statusStyle: Record<string, string> = {
                    PENDING: "bg-yellow-100 text-yellow-800",
                    CONFIRMED: "bg-blue-100 text-blue-800",
                    COMPLETED: "bg-green-100 text-green-800",
                    CANCELLED: "bg-red-100 text-red-800",
                  };
                  const statusLabel: Record<string, string> = {
                    PENDING: "Chờ xác nhận",
                    CONFIRMED: "Đã xác nhận",
                    COMPLETED: "Hoàn thành",
                    CANCELLED: "Đã hủy",
                  };
                  return (
                    <div 
                      key={booking._id} 
                      onClick={booking.status === 'PENDING' ? () => router.push("/owner/bookings") : undefined}
                      className={`p-5 flex items-center gap-4 transition-all ${
                        booking.status === 'PENDING' 
                        ? 'hover:bg-surface-container-low hover:shadow-md cursor-pointer border-l-4 border-yellow-400' 
                        : 'cursor-default opacity-70'
                      }`}
                    >
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${statusStyle[booking.status] ?? 'bg-surface-container text-on-surface'}`}>
                            {statusLabel[booking.status] ?? booking.status}
                          </span>
                          {booking.status === 'PENDING' && (
                            <span className="text-[10px] font-bold text-yellow-700 animate-pulse">⏳ Cần xử lý</span>
                          )}
                        </div>
                        <p className="font-bold text-on-surface truncate">{booking.court_id?.name || 'Sân thể thao'}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mt-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">person</span>
                            {booking.user_id?.name || 'Khách'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                            {new Date(booking.booking_date).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {booking.start_time} – {booking.end_time}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-bold text-primary text-sm">{booking.total_price?.toLocaleString('vi-VN')} ₫</span>
                        {booking.status === 'PENDING' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-on-primary shadow-sm">
                            Xử lý →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Right Column: Venue Summary */}
        <div className="xl:col-span-1 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Trạng thái cụm sân</h3>
          </div>

          {venues.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden p-8 text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">stadium</span>
              <h4 className="text-on-surface font-bold font-display text-lg mb-2">Chưa có cụm sân nào</h4>
              <p className="text-on-surface-variant text-sm font-body mb-6">Bạn cần tạo cụm sân để bắt đầu quản lý hoạt động kinh doanh.</p>
              <a href="/owner/courts" className="px-6 py-2 bg-primary hover:bg-primary-container text-white font-headline font-semibold rounded-full transition-colors text-sm">Thêm Cụm Sân</a>
            </div>
          ) : (
            venues.map((venue) => (
              <div key={venue._id} className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden">
                <div className="p-6 border-b border-surface-container-low">
                  <h4 className="text-on-surface font-display font-bold text-lg">{venue.name}</h4>
                  <p className="text-on-surface-variant font-body text-xs mt-1 flex items-start gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {venue.district}, {venue.city}</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${venue.status === 'ACTIVE' ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                      <span className="text-sm font-semibold font-body text-on-surface">{venue.status === 'ACTIVE' ? 'Hoạt động' : 'Đang bảo trì'}</span>
                    </div>
                  </div>
                  <a href="/owner/courts" className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary font-headline font-semibold rounded-lg transition-colors text-sm" style={{ display: "block", textAlign: "center" }}>Quản lý cụm sân</a>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}