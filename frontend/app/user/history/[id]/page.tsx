"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) { router.push("/login"); return; }
      try {
        const res = await fetch(`http://localhost:5000/api/users/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        } else {
          setError("Không tìm thấy đơn đặt sân.");
        }
      } catch {
        setError("Lỗi kết nối máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, router]);

  const handleCancel = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setCancelling(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cancel_reason: cancelReason }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBooking(updated.booking || { ...booking, status: "CANCELLED" });
        setShowCancelDialog(false);
      } else {
        const err = await res.json();
        alert(err.message || "Hủy đặt sân thất bại.");
      }
    } catch {
      alert("Lỗi kết nối.");
    } finally {
      setCancelling(false);
    }
  };

  const handleReview = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSubmittingReview(true);
    try {
      const clusterId = booking?.court_id?.venue_cluster_id || booking?.court_id?.cluster_id;
      const res = await fetch("http://localhost:5000/api/users/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cluster_id: clusterId, rating, comment }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setShowReviewForm(false);
      } else {
        const err = await res.json();
        alert(err.message || "Gửi đánh giá thất bại.");
      }
    } catch {
      alert("Lỗi kết nối.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-body">Đang tải chi tiết đơn đặt sân...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <span className="material-symbols-outlined text-6xl text-outline">error_outline</span>
        <p className="text-on-surface-variant font-body text-lg">{error || "Không tìm thấy đơn đặt sân."}</p>
        <Link href="/user/history" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">
          Quay lại lịch sử
        </Link>
      </div>
    );
  }

  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
  const canReview = booking.status === "COMPLETED" && !reviewSuccess;

  return (
    <>
      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-on-surface">Hủy đặt sân</h3>
                <p className="text-sm text-on-surface-variant">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Lý do hủy (tùy chọn)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                rows={3}
                placeholder="Nhập lý do hủy..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-colors"
              >
                Giữ lại
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-3 rounded-full bg-error text-on-error font-bold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-on-surface">Đánh giá sân</h3>
                <p className="text-sm text-on-surface-variant">{booking.court_id?.name}</p>
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
                onClick={() => setShowReviewForm(false)}
                className="flex-1 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleReview}
                disabled={submittingReview}
                className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link href="/user/history" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Lịch sử đặt sân
          </Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Chi tiết đơn</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Booking Header Card */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>
                    sports_tennis
                  </span>
                </div>
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${STATUS_COLORS[booking.status] || "bg-surface text-on-surface"}`}>
                  {booking.status === "PENDING" && "⏳ "}
                  {booking.status === "CONFIRMED" && "✅ "}
                  {booking.status === "COMPLETED" && "🏆 "}
                  {booking.status === "CANCELLED" && "❌ "}
                  {booking.status}
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-display font-black tracking-tight text-on-surface mb-2">
                  {booking.court_id?.name || "Sân thể thao"}
                </h1>
                <p className="text-on-surface-variant font-body flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {booking.court_id?.description || "Không có địa chỉ"}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
              <h2 className="text-xl font-display font-black text-on-surface mb-6">Thông tin đặt sân</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Ngày đặt</p>
                    <p className="text-base font-bold font-headline text-on-surface">
                      {new Date(booking.booking_date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Khung giờ</p>
                    <p className="text-base font-bold font-headline text-on-surface">
                      {booking.start_time} – {booking.end_time}
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">confirmation_number</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Mã đặt sân</p>
                    <p className="text-base font-bold font-headline text-on-surface font-mono text-xs">
                      {booking._id}
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">grid_view</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Số slot</p>
                    <p className="text-base font-bold font-headline text-on-surface">
                      {booking.slot_count} slot
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel reason if cancelled */}
            {booking.status === "CANCELLED" && booking.cancel_reason && (
              <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-1">info</span>
                  <div>
                    <p className="font-bold text-on-surface mb-1">Lý do hủy</p>
                    <p className="text-on-surface-variant text-sm">{booking.cancel_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Review success banner */}
            {reviewSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="font-bold text-green-800">Cảm ơn bạn đã đánh giá! Phản hồi của bạn rất có giá trị.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Price Summary */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] sticky top-32">
              <h2 className="text-xl font-display font-black text-on-surface mb-6">Tổng thanh toán</h2>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body">Đơn giá / slot</span>
                  <span className="font-bold text-on-surface">
                    {booking.slot_count > 0
                      ? (booking.total_price / booking.slot_count).toLocaleString("vi-VN")
                      : "—"} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body">Số lượng slot</span>
                  <span className="font-bold text-on-surface">{booking.slot_count}</span>
                </div>
                <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-center">
                  <span className="text-lg font-headline font-bold text-on-surface">Tổng cộng</span>
                  <span className="text-2xl font-display font-black text-primary">
                    {booking.total_price?.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {canCancel && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full py-3 rounded-full border-2 border-error/40 text-error font-bold hover:bg-error/5 transition-all"
                  >
                    Hủy đặt sân
                  </button>
                )}
                {canReview && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    Đánh giá sân
                  </button>
                )}
                <Link
                  href="/user/history"
                  className="w-full py-3 rounded-full bg-surface-container-low text-on-surface font-bold hover:bg-surface-container transition-colors text-center"
                >
                  Quay lại lịch sử
                </Link>
                {booking.status === "COMPLETED" && (
                  <Link
                    href={`/user/book/${booking.court_id?._id || ""}`}
                    className="w-full py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all text-center"
                  >
                    Đặt lại sân này
                  </Link>
                )}
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
              <h2 className="text-lg font-display font-black text-on-surface mb-6">Trạng thái đơn</h2>
              <div className="flex flex-col gap-4">
                {[
                  { status: "PENDING", label: "Chờ xác nhận", icon: "pending" },
                  { status: "CONFIRMED", label: "Đã xác nhận", icon: "check_circle" },
                  { status: "COMPLETED", label: "Hoàn thành", icon: "sports_score" },
                ].map((step, idx) => {
                  const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
                  const currentIdx = statuses.indexOf(booking.status);
                  const stepIdx = statuses.indexOf(step.status);
                  const isDone = booking.status !== "CANCELLED" && currentIdx >= stepIdx;
                  const isCurrent = booking.status === step.status;

                  return (
                    <div key={step.status} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isDone ? "'FILL' 1" : "'FILL' 0" }}>
                          {step.icon}
                        </span>
                      </div>
                      <span className={`font-medium text-sm ${isCurrent ? "text-primary font-bold" : isDone ? "text-on-surface" : "text-on-surface-variant"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
                {booking.status === "CANCELLED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-error text-on-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                    </div>
                    <span className="font-bold text-sm text-error">Đã hủy</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
