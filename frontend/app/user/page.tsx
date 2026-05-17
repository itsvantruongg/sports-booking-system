"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VenueCard from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/ui/Skeleton";

export default function UserDashboardPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sportTypes, setSportTypes] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (locationText.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/public/venues?q=${locationText}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.data ?? []);
          setShowSuggestions(true);
        })
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [locationText]);

  useEffect(() => {
    fetch("http://localhost:5000/api/public/venues?limit=6")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        if (data.data) setVenues(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch sport types
    fetch("http://localhost:5000/api/public/sport-types")
      .then(res => res.json())
      .then(data => setSportTypes(Array.isArray(data) ? data : data.data ?? []))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSport) params.set("sport", selectedSport);
    if (locationText) params.set("q", locationText);
    router.push(`/fields?${params.toString()}`);
  };

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8 lg:py-16">
        <div className="bg-neutral-900 rounded-3xl overflow-hidden relative min-h-[550px] flex items-center shadow-xl border border-white/10">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2069&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          >
            <source src="https://res.cloudinary.com/dtsf98n7p/video/upload/v1715872856/football_training_xh0qjx.mp4" type="video/mp4" />
          </video>
          {/* Lớp phủ mờ và tối hơn để nổi bật chữ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 p-8 lg:p-20 w-full max-w-5xl">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary/20 text-primary-container px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-primary/30 backdrop-blur-sm">
                Chào mừng trở lại!
              </span>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                Đặt sân thể thao <br />
                <span className="text-primary underline decoration-primary/40">nhanh chóng</span> và <span className="text-primary underline decoration-primary/40">tiện lợi</span>
              </h1>
              <p className="text-lg text-white/80 mb-12 font-body max-w-lg leading-relaxed">
                Khám phá hàng trăm sân bãi chất lượng cao và đặt lịch ngay chỉ với vài thao tác đơn giản.
              </p>
            </div>
            
            {/* Search Bar Glassmorphism */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-md p-5 rounded-2xl shadow-[0_20px_60px_rgba(25,27,37,0.1)] max-w-4xl border border-white/20 relative">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-black text-on-surface-variant mb-2 ml-1 uppercase tracking-wider">Môn thể thao</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">sports_soccer</span>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-body cursor-pointer appearance-none"
                    >
                      <option value="">Tất cả môn</option>
                      {sportTypes.map(st => (
                        <option key={st._id} value={st._id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1 w-full relative">
                  <label className="block text-xs font-black text-on-surface-variant mb-2 ml-1 uppercase tracking-wider">Địa điểm / Khu vực</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">location_on</span>
                    <input
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-body"
                      placeholder="Thành phố, Quận, Tên sân..."
                      type="text"
                    />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 border-b border-outline-variant/5">
                        <p className="text-[10px] font-black text-outline uppercase tracking-widest ml-1">Kết quả tìm kiếm nhanh</p>
                      </div>
                      {suggestions.map(v => (
                        <button
                          key={v._id}
                          type="button"
                          onClick={() => {
                            setLocationText(v.name);
                            setShowSuggestions(false);
                            router.push(`/fields/${v._id}`);
                          }}
                          className="w-full p-4 flex items-center gap-4 hover:bg-primary/5 text-left transition-colors border-b border-outline-variant/5 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">stadium</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-on-surface truncate">{v.name}</p>
                            <p className="text-xs text-on-surface-variant truncate">{v.district}, {v.city}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        type="submit"
                        className="w-full p-3 text-center text-xs font-black text-primary hover:bg-primary/5 transition-colors"
                      >
                        Xem tất cả kết quả cho "{locationText}"
                      </button>
                    </div>
                  )}
                </div>
                <button className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 rounded-xl font-headline font-black hover:shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md" type="submit">
                  <span className="material-symbols-outlined">search</span> Tìm kiếm
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courts */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-on-surface tracking-tight mb-2">Sân bãi gợi ý</h2>
            <p className="text-on-surface-variant font-body opacity-80">Dựa trên sở thích và vị trí của bạn.</p>
          </div>
          <Link href="/fields" className="hidden md:flex items-center gap-2 text-primary font-black hover:gap-3 transition-all text-sm uppercase tracking-widest">
            Xem tất cả <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <VenueCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} href={`/user/book/${venue._id}`} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Stats / Info */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-10 rounded-[2rem] border border-outline-variant/10 hover:shadow-xl transition-all group">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl">history</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-4">Lịch sử đặt sân</h3>
            <p className="text-on-surface-variant font-bold opacity-60 leading-relaxed mb-6">Quản lý và xem lại tất cả các trận đấu bạn đã tham gia.</p>
            <Link href="/user/history" className="text-primary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">Xem ngay <span className="material-symbols-outlined text-sm">east</span></Link>
          </div>
          
          <div className="bg-surface-container-low p-10 rounded-[2rem] border border-outline-variant/10 hover:shadow-xl transition-all group">
            <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary text-3xl">favorite</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-4">Sân yêu thích</h3>
            <p className="text-on-surface-variant font-bold opacity-60 leading-relaxed mb-6">Truy cập nhanh vào các cụm sân bạn thường xuyên lui tới.</p>
            <Link href="/user/favorites" className="text-secondary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">Xem ngay <span className="material-symbols-outlined text-sm">east</span></Link>
          </div>

          <div className="bg-surface-container-low p-10 rounded-[2rem] border border-outline-variant/10 hover:shadow-xl transition-all group">
            <div className="bg-tertiary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary text-3xl">account_circle</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-4">Hồ sơ cá nhân</h3>
            <p className="text-on-surface-variant font-bold opacity-60 leading-relaxed mb-6">Cập nhật thông tin cá nhân và cài đặt tài khoản của bạn.</p>
            <Link href="/user/profile" className="text-tertiary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">Xem ngay <span className="material-symbols-outlined text-sm">east</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
