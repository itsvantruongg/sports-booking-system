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
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/fields");
  };

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8 lg:py-16">
        <div className="bg-surface-container-low rounded-[2rem] overflow-hidden relative min-h-[460px] flex items-center shadow-2xl border border-outline-variant/10">
          <img 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            alt="Sports background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent"></div>
          
          <div className="relative z-10 p-8 lg:p-16 w-full max-w-5xl">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
                Chào mừng trở lại!
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-on-surface tracking-tighter leading-[1] mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Sẵn sàng cho <br />
                <span className="text-primary">trận đấu mới?</span>
              </h1>
              <p className="text-lg text-on-surface-variant mb-10 font-bold opacity-80 max-w-lg leading-relaxed">
                Khám phá hàng trăm sân bãi chất lượng cao và đặt lịch ngay chỉ với vài thao tác đơn giản.
              </p>
            </div>
            
            {/* Search Bar Glassmorphism */}
            <div className="bg-surface-container-lowest/60 backdrop-blur-xl p-3 rounded-[1.5rem] shadow-2xl border border-outline-variant/10 max-w-3xl">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">sports_soccer</span>
                  <select className="w-full pl-12 pr-4 py-4 bg-surface-container/50 border border-transparent rounded-2xl focus:border-primary/30 focus:ring-4 focus:ring-primary/5 text-on-surface font-black text-sm cursor-pointer appearance-none outline-none transition-all">
                    <option>Tất cả môn thể thao</option>
                    <option>Bóng đá</option>
                    <option>Tennis</option>
                    <option>Cầu lông</option>
                  </select>
                </div>
                <div className="flex-1 relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">location_on</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-surface-container/50 border border-transparent rounded-2xl focus:border-primary/30 focus:ring-4 focus:ring-primary/5 text-on-surface font-black text-sm outline-none transition-all" placeholder="Bạn muốn chơi ở đâu?" type="text" />
                </div>
                <button className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
                  <span className="material-symbols-outlined text-sm">search</span> Tìm kiếm
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
            <h2 className="text-3xl font-black text-on-surface tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Sân bãi gợi ý</h2>
            <p className="text-on-surface-variant font-bold opacity-60">Dựa trên sở thích và vị trí của bạn.</p>
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
