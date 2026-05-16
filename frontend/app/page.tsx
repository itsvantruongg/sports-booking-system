"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VenueCard from "@/components/venue/VenueCard";

export default function LandingPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<any[]>([]);
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
    // Fetch venues
    fetch("http://localhost:5000/api/public/venues?limit=6")
      .then(res => res.json())
      .then(data => {
        if (data.data) setVenues(data.data);
      })
      .catch(console.error);

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
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
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
                <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                  Đặt sân thể thao <br />
                  <span className="text-primary underline decoration-primary/40">nhanh chóng</span> và <span className="text-primary underline decoration-primary/40">tiện lợi</span>
                </h1>
                <p className="text-lg text-white/80 mb-12 font-body max-w-lg leading-relaxed">
                  Tìm kiếm, đặt chỗ và thanh toán trong vài giây. Bắt đầu trận đấu của bạn ngay hôm nay tại các sân thể thao hàng đầu.
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
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-on-surface tracking-tight mb-2">Sân nổi bật</h2>
              <p className="text-on-surface-variant font-body opacity-80">Các sân vận động được đánh giá cao nhất trong tuần này.</p>
            </div>
            <Link href="/fields" className="hidden md:flex items-center gap-2 text-primary font-black hover:gap-3 transition-all text-sm">
              Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.length === 0 ? (
              <p className="text-on-surface-variant col-span-3 text-center py-12 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
                Đang tải danh sách sân hoặc chưa có sân nào khả dụng...
              </p>
            ) : (
              venues.map((venue) => (
                <VenueCard key={venue._id} venue={venue} href={`/fields/${venue._id}`} />
              ))
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-on-surface tracking-tight mb-4">Tại sao chọn Kinetic?</h2>
            <p className="text-on-surface-variant text-lg opacity-80">Trải nghiệm đặt sân thể thao mượt mà, chuyên nghiệp và đáng tin cậy nhất.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "bolt", title: "Đặt chỗ siêu tốc", desc: "Tìm kiếm và xác nhận lịch trống trong thời gian thực. Không cần gọi điện, không cần chờ đợi xác nhận." },
              { icon: "category", title: "Đa dạng môn thể thao", desc: "Từ bóng đá sân cỏ nhân tạo, Padel hiện đại đến sân cầu lông tiêu chuẩn. Mọi nhu cầu thể thao của bạn đều được đáp ứng." },
              { icon: "credit_card", title: "Thanh toán dễ dàng", desc: "Hỗ trợ đa dạng phương thức thanh toán an toàn, từ ví điện tử đến chuyển khoản ngân hàng." }
            ].map((benefit, i) => (
              <div key={i} className="bg-surface-container-low p-10 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10 group">
                <div className="bg-primary/10 p-4 rounded-2xl mb-8 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-xl font-display font-black text-on-surface mb-4">{benefit.title}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed opacity-80">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
