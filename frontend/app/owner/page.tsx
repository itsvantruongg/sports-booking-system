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
  const [stats, setStats] = useState({ revenue: 0, debt: 0, occupancy: 0, booking_count: 0 });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch dashboard stats
        try {
          const statsRes = await fetch("http://localhost:5000/api/owner/dashboard?range=today", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } catch (e) {
          console.error("Lỗi khi fetch dashboard:", e);
        }

        // Fetch venues
        try {
          const venuesRes = await fetch("http://localhost:5000/api/owner/venues", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (venuesRes.ok) {
            const venuesData = await venuesRes.json();
            setVenues(venuesData);
          }
        } catch (e) {
          console.error("Lỗi khi fetch venues:", e);
        }

        // Fetch recent bookings (limit 5)
        try {
          const bookingsRes = await fetch("http://localhost:5000/api/owner/bookings?limit=5", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            const list = Array.isArray(bookingsData) ? bookingsData : bookingsData.data ?? [];
            setRecentBookings(list.slice(0, 5));
          }
        } catch (e) {
          console.error("Lỗi khi fetch bookings:", e);
        }

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu owner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return <div className="p-8 lg:p-12 h-screen flex justify-center items-center">Đang tải dữ liệu...</div>;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-8 lg:p-12">
{/* Header */}
<header className="flex justify-between items-end mb-12">
<div>
<p className="text-on-surface-variant font-body text-lg mb-1">{currentDate}</p>
<h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-on-surface">Good morning, Facility Admin</h2>
</div>
<div className="hidden md:flex gap-4">
<button className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">A</div>
</div>
</header>
{/* Quick Stats Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
  {/* Stat Card 1 */}
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <span className="material-symbols-outlined text-6xl text-primary">sports_tennis</span>
    </div>
    <h3 className="text-on-surface-variant font-body font-medium mb-2 text-sm">Today's Bookings</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-black font-display tracking-tighter text-on-surface">{stats.booking_count}</span>
    </div>
  </div>

  {/* Stat Card 2 */}
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group border-b-4 border-green-500">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <span className="material-symbols-outlined text-6xl text-green-600">payments</span>
    </div>
    <h3 className="text-on-surface-variant font-body font-medium mb-2 text-sm">Revenue (Paid)</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-black font-display tracking-tighter text-on-surface">{stats.revenue.toLocaleString('vi-VN')} ₫</span>
    </div>
  </div>

  {/* Stat Card 3 (Debt) */}
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group border-b-4 border-yellow-500">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <span className="material-symbols-outlined text-6xl text-yellow-600">account_balance_wallet</span>
    </div>
    <h3 className="text-on-surface-variant font-body font-medium mb-2 text-sm">Treo nợ (Cash)</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-black font-display tracking-tighter text-on-surface text-yellow-700">{stats.debt.toLocaleString('vi-VN')} ₫</span>
    </div>
  </div>

  {/* Stat Card 4 */}
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <span className="material-symbols-outlined text-6xl text-tertiary">pie_chart</span>
    </div>
    <h3 className="text-on-surface-variant font-body font-medium mb-2 text-sm">Occupancy</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black font-display tracking-tighter text-on-surface">{stats.occupancy}</span>
      <span className="text-on-surface-variant font-body text-xs">Slots</span>
    </div>
  </div>
</div>
{/* Asymmetric Content Area */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
{/* Left Column: Recent Bookings */}
<div className="xl:col-span-2 space-y-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Recent Bookings</h3>
<Link href="/owner/bookings" className="text-primary font-headline font-semibold text-sm hover:underline">View All</Link>
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
        <div key={booking._id} className={`p-5 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors ${booking.status === 'PENDING' ? 'border-l-4 border-yellow-400' : ''}`}>
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
            <span className="font-black text-primary text-sm">{booking.total_price?.toLocaleString('vi-VN')} ₫</span>
            {booking.status === 'PENDING' && (
              <Link href="/owner/bookings" className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-on-primary hover:shadow-md transition-all">
                Xử lý →
              </Link>
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
<h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Venue Status</h3>
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
        <a href="/owner/courts" className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary font-headline font-semibold rounded-lg transition-colors text-sm" style={{ display: "block", textAlign: "center" }}>Manage Venue</a>
      </div>
    </div>
  ))
)}

</div>
</div>
    </div>
  );
}
