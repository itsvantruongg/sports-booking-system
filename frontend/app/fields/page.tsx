"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import VenueCard from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/ui/Skeleton";

interface SportType { _id: string; name: string; slug: string; }
interface Venue { _id: string; name: string; address: string; district: string; city: string; status: string; avg_rating: number; images: { url: string }[]; sport_type?: { name: string }; }

export default function PublicFieldsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport") ?? "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") ?? "");
  const [districtFilter, setDistrictFilter] = useState(searchParams.get("district") ?? "");
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchText(q);
      const knownCities = ["hà nội", "tp. hồ chí minh", "đà nẵng", "hải phòng", "cần thơ"];
      if (knownCities.includes(q.toLowerCase())) {
        setCityFilter(q);
      }
    }
    
    const sport = searchParams.get("sport");
    if (sport !== null) setSelectedSport(sport);

    const city = searchParams.get("city");
    if (city !== null) setCityFilter(city);

    const district = searchParams.get("district");
    if (district !== null) setDistrictFilter(district);
  }, [searchParams]);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSport) params.set("sport", selectedSport);
    if (cityFilter) params.set("city", cityFilter);
    if (districtFilter) params.set("district", districtFilter);
    if (searchText) params.set("q", searchText);
    params.set("limit", "24");
    try {
      const res = await fetch(`http://localhost:5000/api/public/venues?${params.toString()}`);
      const data = await res.json();
      let list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        list = list.filter((v: any) => 
          (v.name ?? "").toLowerCase().includes(q) || 
          (v.address ?? "").toLowerCase().includes(q) || 
          (v.city ?? "").toLowerCase().includes(q) ||
          (v.district ?? "").toLowerCase().includes(q)
        );
      }
      setVenues(list);
    } catch { console.error("Fetch venues error"); }
    finally { setLoading(false); }
  }, [selectedSport, cityFilter, districtFilter, searchText]);

  useEffect(() => {
    fetch("http://localhost:5000/api/public/sport-types")
      .then(r => r.json())
      .then(d => {
        const types = Array.isArray(d) ? d : d.data ?? [];
        setSportTypes(types);

        const initialSport = searchParams.get("sport");
        if (initialSport) {
          let match = types.find((t: any) => t._id === initialSport || t.slug === initialSport);
          if (!match && initialSport === "pickleball") {
            match = types.find((t: any) => t.slug === "da-nang");
          }
          if (match) {
            setSelectedSport(match._id);
          }
        }
      })
      .catch(console.error);
  }, [searchParams]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues, selectedSport, cityFilter, districtFilter, searchText]);

  const applyFilters = () => fetchVenues();
  const resetFilters = () => { setSelectedSport(""); setCityFilter(""); setDistrictFilter(""); setSearchText(""); };

  const renderFilters = (isMobile = false) => (
    <div className={isMobile ? "space-y-6" : "bg-surface-container-low rounded-2xl p-8 sticky top-32 shadow-sm border border-outline-variant/5"}>
      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-on-surface" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Bộ lọc</h2>
          {(selectedSport || cityFilter || districtFilter || searchText) && (
            <button onClick={resetFilters} className="text-xs font-bold text-primary hover:text-primary/70 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">close</span> Xóa lọc
            </button>
          )}
        </div>
      )}

      {/* Sport Type */}
      <div className={isMobile ? "" : "mb-6"}>
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-wider mb-3">Môn thể thao</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSport("")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${!selectedSport ? "bg-primary text-on-primary border-primary shadow-sm" : "bg-surface-container border-outline-variant/30 text-on-surface hover:border-primary/50"}`}
          >
            Tất cả
          </button>
          {sportTypes.map(st => (
            <button
              key={st._id}
              onClick={() => setSelectedSport(st._id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedSport === st._id ? "bg-primary text-on-primary border-primary shadow-sm" : "bg-surface-container border-outline-variant/30 text-on-surface hover:border-primary/50"}`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className={isMobile ? "" : "mb-6"}>
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-wider mb-3">Thành phố</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">location_city</span>
          <input
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all text-sm text-on-surface"
            placeholder="Vd: Hà Nội, TP.HCM..."
          />
        </div>
      </div>

      {/* District */}
      <div className={isMobile ? "" : "mb-6"}>
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-wider mb-3">Quận / Huyện</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">map</span>
          <input
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all text-sm text-on-surface"
            placeholder="Vd: Cầu Giấy, Đống Đa..."
          />
        </div>
      </div>

      {!isMobile && (
        <button
          onClick={applyFilters}
          className="w-full bg-primary text-on-primary py-3.5 rounded-full font-black hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Áp dụng bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <Navbar 
        searchText={searchText} 
        onSearchChange={setSearchText} 
        onSearchSubmit={applyFilters} 
      />

      <main className="pt-12 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-80 flex-shrink-0">
          {renderFilters(false)}
        </aside>

        {/* Mobile Bottom Sheet Filters */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] md:hidden flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest text-on-surface w-full rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-primary/5 shrink-0">
                <h3 className="text-lg font-black text-on-surface">Bộ lọc tìm kiếm</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {renderFilters(true)}
              </div>
              <div className="p-6 bg-surface-container-low flex gap-3 shrink-0 pb-8">
                <button 
                  onClick={() => { resetFilters(); setShowMobileFilters(false); }} 
                  className="flex-1 py-3.5 rounded-full border border-outline-variant text-on-surface font-bold text-sm"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => { applyFilters(); setShowMobileFilters(false); }}
                  className="flex-1 py-3.5 rounded-full bg-primary text-on-primary font-bold shadow-md shadow-primary/20 text-sm"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
 
        {/* Fields Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-on-surface mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Tất cả sân</h1>
              <p className="text-on-surface-variant text-sm">Tìm kiếm và đặt các cụm sân tốt nhất.</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant w-full md:w-auto justify-between md:justify-end">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden px-5 py-2.5 rounded-full bg-primary text-on-primary font-black text-xs flex items-center gap-2 shadow-md shadow-primary/10"
              >
                <span className="material-symbols-outlined text-[16px]">filter_list</span> Bộ lọc
              </button>
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Đang tìm...</span>
                : <span className="font-bold text-on-surface">{venues.length} kết quả</span>
              }
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedSport || cityFilter || districtFilter || searchText) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedSport && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                  {sportTypes.find(s => s._id === selectedSport)?.name ?? selectedSport}
                  <button onClick={() => setSelectedSport("")} className="ml-1 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
              {cityFilter && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                  📍 {cityFilter}
                  <button onClick={() => setCityFilter("")} className="ml-1 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
              {districtFilter && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                  🗺 {districtFilter}
                  <button onClick={() => setDistrictFilter("")} className="ml-1 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
              {searchText && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                  🔍 "{searchText}"
                  <button onClick={() => setSearchText("")} className="ml-1 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <VenueCardSkeleton key={i} />)}
            </div>
          ) : venues.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 text-on-surface-variant gap-4 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-7xl opacity-30">search_off</span>
              <div className="text-center">
                <p className="text-xl font-bold text-on-surface">Không tìm thấy sân phù hợp</p>
                <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
              <button onClick={resetFilters} className="mt-4 px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all shadow-md">
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {venues.map(venue => (
                <VenueCard key={venue._id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
