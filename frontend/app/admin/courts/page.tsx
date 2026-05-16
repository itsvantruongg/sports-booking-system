"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Venue {
  _id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  avg_rating?: number;
  images?: { url: string }[];
  sport_type?: { name: string };
  owner_id?: { name: string; email: string };
}

const STATUS_CONFIG = {
  ACTIVE:   { label: "Hoạt động",  bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  INACTIVE: { label: "Tạm ngưng",  bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  BANNED:   { label: "Bị khóa",    bg: "bg-red-100",   text: "text-red-800",   dot: "bg-red-500" },
};

export default function AdminCourtsPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "INACTIVE" | "BANNED">("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVenues = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`http://localhost:5000/api/admin/venues?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVenues(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch { console.error("Fetch venues error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVenues(); }, [statusFilter]);

  const updateVenueStatus = async (venueId: string, newStatus: "ACTIVE" | "INACTIVE" | "BANNED") => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setActionId(venueId);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/venues/${venueId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setVenues(prev => prev.map(v => v._id === venueId ? { ...v, status: newStatus } : v));
        const label = STATUS_CONFIG[newStatus].label;
        showToast(`✅ Đã cập nhật trạng thái cụm sân thành "${label}"`, "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Cập nhật thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setActionId(null); }
  };

  const filtered = venues.filter(v => {
    const q = search.toLowerCase();
    return !q || v.name.toLowerCase().includes(q) || (v.address ?? "").toLowerCase().includes(q) || (v.owner_id?.name ?? "").toLowerCase().includes(q);
  });

  const stats = {
    total: venues.length,
    active: venues.filter(v => v.status === "ACTIVE").length,
    banned: venues.filter(v => v.status === "BANNED").length,
  };

  return (
    <div className="p-6 md:p-12 min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Quản lý Cụm sân
          </h2>
          <p className="text-on-surface-variant">Giám sát và quản lý tất cả cụm sân trên nền tảng.</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary transition-colors w-64 md:w-80 outline-none text-sm"
            placeholder="Tìm tên sân, chủ sân..."
          />
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Tổng cụm sân", value: stats.total, icon: "stadium", color: "text-primary" },
          { label: "Đang hoạt động", value: stats.active, icon: "check_circle", color: "text-green-600" },
          { label: "Bị khóa", value: stats.banned, icon: "lock", color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_24px_rgba(25,27,37,0.04)]">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-black text-on-surface">{loading ? "—" : s.value}</p>
              <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(["", "ACTIVE", "INACTIVE", "BANNED"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${statusFilter === s ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
          >
            {s === "" ? "Tất cả" : STATUS_CONFIG[s].label}
          </button>
        ))}
        <button onClick={fetchVenues} className="ml-auto flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-bold text-sm transition-all">
          <span className="material-symbols-outlined text-[16px]">refresh</span> Làm mới
        </button>
      </div>

      {/* Venue Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-surface-container" />
              <div className="p-5">
                <div className="h-4 bg-surface-container rounded mb-2 w-3/4" />
                <div className="h-3 bg-surface-container rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">search_off</span>
          <p className="text-lg font-bold">Không tìm thấy cụm sân nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(venue => {
            const sc = STATUS_CONFIG[venue.status] ?? STATUS_CONFIG.INACTIVE;
            const isLoading = actionId === venue._id;
            return (
              <article key={venue._id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(25,27,37,0.04)] hover:shadow-[0_20px_60px_rgba(25,27,37,0.08)] transition-all group flex flex-col">
                <div className="relative h-48 overflow-hidden bg-surface-container">
                  <img
                    src={venue.images?.[0]?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBO3D2CdhXjBRagu9Q-4WgBnHqpw6jF-5SX3CB-4-lukYLZ5_-FlG7VsQ9jP7CFaaoqBxYfWjYWnFn_2bT3udNFeJAzF41XPq0lDnQTVd02C3fhSbAahAh_QmHl70vQwj4aMGJipPNbeCqkTnSIqfxKJwIMvLwpfh-MKvJRNrWuJdJyddBdVMOjWbEDwEZgGwgSeJCB4XicphsDFf09t1c_Jj08jN4IaXwG_qol5cuAATqWLs8e1PkhSYmBZ20rJjczAWoruYQr9hY"}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} /> {sc.label}
                  </div>
                  {venue.avg_rating != null && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-yellow-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-black text-xs text-gray-800">{venue.avg_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-1">
                    {venue.sport_type?.name && (
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{venue.sport_type.name}</span>
                    )}
                  </div>
                  <h3 className="font-black text-lg text-on-surface leading-tight mb-2 line-clamp-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    {venue.name}
                  </h3>
                  <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant mb-4 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="line-clamp-1">{venue.address || `${venue.district}, ${venue.city}`}</span>
                    </div>
                    {venue.owner_id?.name && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">badge</span>
                        <span className="line-clamp-1">Chủ sở hữu: {venue.owner_id.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-surface-container pt-4 flex flex-col gap-2">
                    {venue.status !== "ACTIVE" && (
                      <button
                        onClick={() => updateVenueStatus(venue._id, "ACTIVE")}
                        disabled={isLoading}
                        className="w-full py-2 rounded-full bg-green-500 text-white font-black text-xs hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-1"
                      >
                        {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                        Mở khóa
                      </button>
                    )}
                    {venue.status !== "BANNED" && (
                      <button
                        onClick={() => updateVenueStatus(venue._id, "BANNED")}
                        disabled={isLoading}
                        className="w-full py-2 rounded-full border border-error/40 text-error font-black text-xs hover:bg-error/5 transition-all disabled:opacity-60 flex items-center justify-center gap-1"
                      >
                        {isLoading ? <span className="w-3 h-3 border-2 border-error border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[14px]">lock</span>}
                        Khóa cụm sân
                      </button>
                    )}
                    {venue.status === "ACTIVE" && (
                      <button
                        onClick={() => updateVenueStatus(venue._id, "INACTIVE")}
                        disabled={isLoading}
                        className="w-full py-2 rounded-full border border-outline-variant text-on-surface-variant font-black text-xs hover:bg-surface-container-low transition-all disabled:opacity-60 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">pause_circle</span>
                        Tạm ngưng
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="h-16" />
    </div>
  );
}
