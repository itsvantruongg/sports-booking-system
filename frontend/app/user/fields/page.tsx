"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VenueCard from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/ui/Skeleton";

export default function UserFieldsPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/public/venues");
      const data = await res.json();
      let list = data.data ?? data ?? [];
      
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        list = list.filter((v: any) => 
          v.name.toLowerCase().includes(q) || 
          (v.address ?? "").toLowerCase().includes(q)
        );
      }
      setVenues(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col">
      <main className="flex-1 pt-12 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        {/* Search Bar Integration inside page content */}
        <div className="mb-12 max-w-2xl mx-auto md:mx-0">
          <div className="flex items-center bg-surface-container-low rounded-3xl px-6 py-4 gap-3 border border-outline-variant/10 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
            <span className="material-symbols-outlined text-primary">search</span>
            <input 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchVenues()}
              placeholder="Tìm tên sân hoặc địa chỉ..."
              className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-on-surface-variant/40"
            />
            {searchText && (
              <button onClick={() => { setSearchText(""); fetchVenues(); }} className="text-on-surface-variant opacity-40 hover:opacity-100">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
            <button 
              onClick={fetchVenues}
              className="bg-primary text-on-primary px-6 py-2 rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-primary/20 transition-all ml-2"
            >
              Tìm
            </button>
          </div>
        </div>


        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Khám phá sân chơi</h1>
            <p className="text-on-surface-variant font-medium opacity-70">Tìm kiếm và đặt lịch tại các cụm sân chất lượng nhất.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-[18px]">list_alt</span>
            {venues.length} kết quả
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <VenueCardSkeleton key={i} />)}
          </div>
        ) : venues.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant text-on-surface-variant">
            <span className="material-symbols-outlined text-7xl opacity-20 mb-4">search_off</span>
            <p className="text-xl font-bold text-on-surface">Không tìm thấy sân phù hợp</p>
            <button onClick={() => setSearchText("")} className="mt-6 text-primary font-black hover:underline">Xóa tìm kiếm</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} href={`/user/book/${venue._id}`} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
