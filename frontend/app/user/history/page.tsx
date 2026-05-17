"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

export default function UserHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'UNPAID' | 'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/users/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : data.data ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    const bookingId = new URLSearchParams(window.location.search).get('bookingId');
    if (status === 'success') {
      setToast({ message: `Thanh toán đơn hàng #${bookingId?.slice(-6).toUpperCase()} thành công!`, type: 'success' });
      // Xóa query params sau khi đã hiện toast
      window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'failed') {
      setToast({ message: 'Thanh toán không thành công. Vui lòng thử lại.', type: 'error' });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'error') {
      setToast({ message: 'Có lỗi xảy ra trong quá trình thanh toán.', type: 'error' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const filteredBookings = bookings.filter((b) => {
    // Determine effective status for local filtering
    let effectiveStatus = b.status;
    let isUnpaid = false;

    if (b.status === 'PENDING') {
      if (b.payment_method === 'BANKING') {
        // Already selected banking and waiting for owner confirmation -> Upcoming
        isUnpaid = false;
      } else {
        // Waiting for payment method selection
        if (b.expires_at && new Date(b.expires_at).getTime() > now) {
          isUnpaid = true;
        } else {
          // Expired or old broken booking without expires_at -> treat as Cancelled locally
          effectiveStatus = 'CANCELLED';
        }
      }
    }

    if (activeTab === 'UNPAID') return isUnpaid;
    if (activeTab === 'Upcoming') return ['PENDING', 'CONFIRMED'].includes(effectiveStatus) && !isUnpaid;
    if (activeTab === 'Completed') return effectiveStatus === 'COMPLETED';
    if (activeTab === 'Cancelled') return effectiveStatus === 'CANCELLED';
    return true;
  });

  const totalHours = bookings.reduce((sum, b) => {
    if (b.status === 'COMPLETED') {
      const start = new Date(`1970-01-01T${b.start_time}:00Z`);
      const end = new Date(`1970-01-01T${b.end_time}:00Z`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  const upcomingCount = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status)).length;

  const handleCancel = async (bookingId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setCancellingId(bookingId);
    try {
      const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ cancel_reason: 'User cancelled via dashboard' }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b));
        setConfirmCancelId(null);
        setToast({ message: "Đã hủy đơn đặt sân thành công", type: "success" });
      } else {
        const err = await res.json();
        setToast({ message: err.message || "Không thể hủy đơn này", type: "error" });
      }
    } catch {
      setToast({ message: "Lỗi kết nối máy chủ", type: "error" });
    } finally {
      setCancellingId(null);
    }
  };
  
  const handleReview = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    if (rating === 0) {
      setToast({ message: "Vui lòng đánh giá sân bằng cách chọn số sao.", type: "error" });
      return;
    }
    setSubmittingReview(true);
    try {
      const booking = selectedBookingForReview;
      const clusterId = booking?.court_id?.venue_cluster_id || booking?.court_id?.cluster_id;
      const res = await fetch("http://localhost:5000/api/users/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ cluster_id: clusterId, rating, comment }),
      });
      if (res.ok) {
        setReviewedBookingIds(prev => [...prev, booking._id]);
        setShowReviewForm(false);
        setRating(0);
        setComment("");
        setToast({ message: "Gửi đánh giá thành công!", type: "success" });
      } else {
        const err = await res.json();
        setToast({ message: err.message || "Gửi đánh giá thất bại.", type: "error" });
      }
    } catch {
      setToast({ message: "Lỗi kết nối máy chủ", type: "error" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'COMPLETED': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30';
    }
  };

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12">
      {toast && <Toast msg={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Contact Owner Dialog (Previously Cancel Dialog) */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-surface-container-low rounded-[2rem] p-10 max-w-sm w-full mx-4 shadow-2xl border border-outline-variant/20">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary">support_agent</span>
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-2">Thông tin liên hệ</h3>
              <p className="text-on-surface-variant font-bold opacity-60 mb-6">
                Để thực hiện hủy lịch, vui lòng liên hệ trực tiếp với chủ sân để được hỗ trợ và hoàn tiền (nếu có).
              </p>
              
              <div className="w-full space-y-3">
                <div className="p-4 rounded-2xl bg-surface-container-highest/30 border border-outline-variant/10 flex flex-col items-center">
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Chủ sân</p>
                  <p className="font-black text-on-surface">
                    {bookings.find(b => b._id === confirmCancelId)?.court_id?.cluster_id?.owner_id?.name || 'Đang cập nhật...'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Số điện thoại</p>
                  <a 
                    href={`tel:${bookings.find(b => b._id === confirmCancelId)?.court_id?.cluster_id?.owner_id?.phone}`}
                    className="text-2xl font-black text-primary hover:underline"
                  >
                    {bookings.find(b => b._id === confirmCancelId)?.court_id?.cluster_id?.owner_id?.phone || 'Chưa có SĐT'}
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => setConfirmCancelId(null)} className="w-full py-4 rounded-2xl font-black text-sm bg-surface-container-highest text-on-surface hover:bg-primary/10 hover:text-primary transition-all">Đã hiểu</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {showReviewForm && selectedBookingForReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-surface-container-low rounded-[2rem] p-8 sm:p-10 max-w-md w-full mx-4 shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-on-surface">Đánh giá sân</h3>
                <p className="text-sm text-on-surface-variant">{selectedBookingForReview.court_id?.name}</p>
              </div>
            </div>
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface-variant mb-3">Đánh giá của bạn</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${star <= rating ? "text-yellow-400" : "text-outline"}`}
                      style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Nhận xét (tùy chọn)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                rows={3}
                placeholder="Chia sẻ trải nghiệm của bạn..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRating(0);
                  setComment("");
                  setShowReviewForm(false);
                  setSelectedBookingForReview(null);
                }}
                className="flex-grow py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleReview}
                disabled={submittingReview}
                className="flex-grow py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Area: History List */}
      <div className="flex-grow space-y-10">
        <header>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Lịch sử đặt sân</h1>
          <p className="text-on-surface-variant font-bold opacity-60">Quản lý các trận đấu sắp tới và xem lại hành trình thể thao của bạn.</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-outline-variant/10">
          {(['UNPAID', 'Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              {tab === 'UNPAID' ? 'Đơn treo' : tab === 'Upcoming' ? 'Sắp diễn ra' : tab === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black text-outline uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-32 text-center bg-surface-container-low rounded-[2.5rem] border border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl opacity-10 mb-4 block">event_busy</span>
              <p className="text-on-surface-variant font-black">Không có lịch đặt sân nào trong mục này.</p>
              <Link href="/fields" className="mt-6 inline-block text-primary font-black hover:underline">Đặt sân ngay</Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-surface-container-low rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-outline-variant/10 group hover:shadow-2xl hover:shadow-primary/5 transition-all">
                <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop" alt="Venue" />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-on-surface mb-2">{booking.court_id?.name || 'Sân thể thao'}</h3>
                      <p className="text-xs font-black text-on-surface-variant opacity-60 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {booking.court_id?.cluster_id?.address || booking.court_id?.cluster_id?.name || 'Địa điểm chưa xác định'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">{booking.total_price?.toLocaleString('vi-VN')} ₫</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${booking.payment_status === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                        {booking.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface-container-highest/30 p-4 rounded-2xl border border-outline-variant/5">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Ngày đá</p>
                      <p className="font-black text-on-surface text-sm">{new Date(booking.booking_date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}</p>
                    </div>
                    <div className="bg-surface-container-highest/30 p-4 rounded-2xl border border-outline-variant/5">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Thời gian</p>
                      <p className="font-black text-on-surface text-sm">{booking.start_time} - {booking.end_time}</p>
                    </div>
                    <div className="bg-surface-container-highest/30 p-4 rounded-2xl border border-outline-variant/5 hidden md:block">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Mã đặt sân</p>
                      <p className="font-black text-on-surface text-sm">#{booking._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        {activeTab === 'UNPAID' ? 'Đang chờ thanh toán' : 'Sân đã sẵn sàng'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {activeTab === 'UNPAID' && (() => {
                        const diff = Math.max(0, Math.floor((new Date(booking.expires_at).getTime() - now) / 1000));
                        const m = Math.floor(diff / 60);
                        const s = diff % 60;
                        const timeString = `${m}:${s.toString().padStart(2, '0')}`;
                        return (
                          <button onClick={() => router.push(`/user/payment?bookingId=${booking._id}&amount=${booking.total_price}`)} className="px-6 py-2.5 rounded-xl bg-primary text-white font-black text-xs shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary/90 transition-all">
                            Thanh toán ngay <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">{timeString}</span>
                          </button>
                        );
                      })()}
                      
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && activeTab !== 'UNPAID' && (
                        <button onClick={() => setConfirmCancelId(booking._id)} className="px-6 py-2.5 rounded-xl font-black text-xs text-red-500 hover:bg-red-500/5 transition-all">Hủy đặt sân</button>
                      )}
                      
                      {booking.status === 'COMPLETED' && !reviewedBookingIds.includes(booking._id) && (
                        <button 
                          onClick={() => {
                            setSelectedBookingForReview(booking);
                            setShowReviewForm(true);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-xs hover:shadow-lg transition-all"
                        >
                          Đánh giá sân
                        </button>
                      )}
                      
                      {activeTab !== 'UNPAID' && (
                        <Link href={`/user/history/${booking._id}`} className="px-6 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-black text-xs hover:bg-primary/10 hover:text-primary transition-all">Chi tiết hóa đơn</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar: Summary */}
      <aside className="w-full lg:w-96 shrink-0">
        <div className="bg-surface-container-low rounded-[2.5rem] p-10 border border-outline-variant/10 sticky top-32 shadow-xl shadow-primary/5">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Thống kê tháng này
          </h3>
          
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Tổng giờ chơi</p>
                  <p className="text-3xl font-black text-on-surface">{totalHours.toFixed(1)} <span className="text-xs font-bold text-outline uppercase">Giờ</span></p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 group hover:border-secondary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Trận sắp tới</p>
                  <p className="text-3xl font-black text-on-surface">{upcomingCount} <span className="text-xs font-bold text-outline uppercase">Trận</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-primary rounded-3xl text-on-primary">
            <p className="text-sm font-black mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Thành viên Kim cương
            </p>
            <p className="text-xs font-bold opacity-80 leading-relaxed">Bạn nhận được ưu đãi giảm 10% cho tất cả các lần đặt sân trong tháng này!</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
