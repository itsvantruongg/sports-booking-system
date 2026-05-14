"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarRating from "@/components/venue/StarRating";

const SPORT_ICON: Record<string, string> = {
  "bóng đá": "sports_soccer",
  "tennis": "sports_tennis",
  "cầu lông": "sports_badminton",
  "bóng rổ": "sports_basketball",
  "bóng chuyền": "sports_volleyball",
  "pickleball": "sports_tennis",
};

export default function PublicVenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/public/venues/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("Không tìm thấy thông tin sân.");
        return r.json();
      })
      .then(json => setVenue(json.data ?? json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if favorited
  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`http://localhost:5000/api/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res.data ?? []);
        setIsFavorite(list.some((v: any) => {
          const vId = typeof v === 'string' ? v : (v._id ?? v.id);
          return vId === id;
        }));
      })
      .catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!id) return;

    setFavLoading(true);
    try {
      if (isFavorite) {
        await fetch(`http://localhost:5000/api/users/favorites/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await fetch(`http://localhost:5000/api/users/favorites`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ venue_id: id }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium">Đang tải thông tin sân...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-surface-container-lowest">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <span className="material-symbols-outlined text-6xl text-outline opacity-30">search_off</span>
          <p className="text-on-surface-variant text-xl font-bold">{error || "Không tìm thấy sân."}</p>
          <Link href="/fields" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all shadow-md">
            Xem tất cả sân
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = venue.images?.length ? venue.images : [{ url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" }];
  const reviews = venue.reviews ?? [];
  const courts = venue.courts ?? [];
  const sportName = venue.sport_type?.name?.toLowerCase() ?? "";
  const sportIcon = SPORT_ICON[sportName] ?? "sports";

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors opacity-70">Trang chủ</Link>
          <span className="opacity-30">/</span>
          <Link href="/fields" className="hover:text-primary transition-colors opacity-70">Tất cả sân</Link>
          <span className="opacity-30">/</span>
          <span className="text-on-surface font-bold">{venue.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Images + Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Image Gallery */}
            <div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="relative h-72 md:h-[450px] overflow-hidden bg-surface-container">
                <img
                  src={images[selectedImage]?.url}
                  alt={venue.name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${venue.status === "ACTIVE" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                  {venue.status === "ACTIVE" ? "● Đang hoạt động" : "● Tạm đóng"}
                </div>
                <button 
                  onClick={toggleFavorite}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                    {isFavorite ? "favorite" : "favorite_border"}
                  </span>
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 p-4 bg-surface-container-low overflow-x-auto no-scrollbar">
                  {images.map((img: any, idx: number) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)}
                      className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Venue Info Header */}
            <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/5">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                      {venue.sport_type?.name || "Đa môn"}
                    </span>
                    <StarRating rating={venue.avg_rating ?? 0} count={reviews.length} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface mb-4 leading-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    {venue.name}
                  </h1>
                  <div className="flex items-start gap-2 text-on-surface-variant font-medium opacity-80">
                    <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">location_on</span>
                    <span>{venue.address || `${venue.district}, ${venue.city}`}</span>
                  </div>
                </div>
                <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-primary/10 items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{sportIcon}</span>
                </div>
              </div>

              {venue.description && (
                <div className="mt-8 pt-8 border-t border-outline-variant/30">
                  <h3 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Mô tả cụm sân
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-lg opacity-90">{venue.description}</p>
                </div>
              )}

              {/* Amenities */}
              {venue.amenities?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-outline-variant/30">
                  <h3 className="text-lg font-black text-on-surface mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Tiện ích đi kèm
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {venue.amenities.map((a: string, i: number) => (
                      <span key={i} className="bg-surface-container-highest/50 text-on-surface-variant px-5 py-2.5 rounded-2xl text-sm font-bold border border-outline-variant/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Courts List */}
            {courts.length > 0 && (
              <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/5">
                <h3 className="text-2xl font-black text-on-surface mb-8 flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Danh sách sân con ({courts.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courts.map((court: any) => (
                    <div key={court._id} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <span className="material-symbols-outlined text-primary text-[22px] group-hover:text-on-primary transition-colors">{sportIcon}</span>
                        </div>
                        <div>
                          <p className="font-black text-on-surface">{court.name}</p>
                          <p className="text-xs text-on-surface-variant font-bold opacity-60">Sân tiêu chuẩn</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${court.status === "ACTIVE" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-outline/10 text-outline border border-outline/20"}`}>
                        {court.status === "ACTIVE" ? "Sẵn sàng" : "Bảo trì"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-on-surface flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Đánh giá từ người chơi
                </h3>
                {reviews.length > 0 && <span className="text-sm font-bold text-primary">{reviews.length} lượt đánh giá</span>}
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-4xl opacity-20 mb-2">rate_review</span>
                  <p className="text-on-surface-variant font-bold">Chưa có đánh giá nào cho sân này</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.slice(0, 5).map((review: any) => (
                    <div key={review._id} className="p-6 rounded-2xl bg-surface-container-lowest/50 border border-outline-variant/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-black text-on-surface">{review.user_id?.name ?? "Người dùng ẩn danh"}</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`material-symbols-outlined text-sm ${s <= review.rating ? "text-yellow-500" : "text-outline opacity-30"}`}
                                  style={{ fontVariationSettings: s <= review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p>
                        </div>
                      </div>
                      {review.comment && <p className="text-on-surface-variant leading-relaxed font-medium opacity-90">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking CTA Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-3xl p-8 shadow-md border border-primary/10 sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Giá tham khảo</p>
                  <p className="text-2xl font-black text-on-surface leading-none">100k - 300k<span className="text-sm font-medium opacity-50 ml-1">/giờ</span></p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Giờ hoạt động</p>
                    <p className="text-sm font-black text-on-surface">{venue.open_time || "06:00"} – {venue.close_time || "22:00"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary">sports</span>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Môn thể thao</p>
                    <p className="text-sm font-black text-on-surface">{venue.sport_type?.name ?? "Đa môn"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary mt-0.5">verified_user</span>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Chính sách</p>
                    <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Xác nhận tức thì, hỗ trợ thay đổi lịch đặt trước 24h.</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/user/book/${id}`}
                className="block w-full text-center bg-primary text-on-primary font-black py-5 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg shadow-xl shadow-primary/20 mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Tiến hành đặt sân
              </Link>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                    isFavorite
                      ? "border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                      : "border-outline-variant/30 text-on-surface-variant hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5"
                  } disabled:opacity-60`}
                >
                  {favLoading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  }
                  {isFavorite ? "Đã lưu yêu thích" : "Thêm vào yêu thích"}
                </button>
                <p className="text-center text-[10px] font-bold text-on-surface-variant opacity-40 px-6">Bằng cách nhấn "Đặt sân", bạn đồng ý với các điều khoản dịch vụ của Kinetic.</p>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/5">
              <h4 className="font-black text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">support_agent</span>
                Cần hỗ trợ?
              </h4>
              <p className="text-sm text-on-surface-variant font-medium mb-6 opacity-80">Nếu bạn gặp khó khăn trong quá trình đặt sân, hãy liên hệ với chúng tôi.</p>
              <div className="flex flex-col gap-3">
                <a href="tel:0123456789" className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-highest/30 hover:bg-primary/10 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined text-sm">phone</span>
                  </div>
                  <span className="text-sm font-black text-on-surface">Hotline: 1900 xxxx</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
