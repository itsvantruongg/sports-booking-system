"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import VenueCard from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/ui/Skeleton";
import Toast from "@/components/ui/Toast";

interface FavoriteVenue {
  _id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  avg_rating: number;
  images: { url: string }[];
  sport_type?: { name: string };
  status: string;
}

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    fetch("http://localhost:5000/api/users/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        const list = Array.isArray(d) ? d : d.data ?? [];
        setFavorites(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <h1 className="text-4xl font-black tracking-tight text-on-surface" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Sân yêu thích</h1>
        </div>
        <p className="text-on-surface-variant font-bold opacity-60">Danh sách các sân vận động bạn đã quan tâm và lưu lại.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <VenueCardSkeleton key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-surface-container-low rounded-[2.5rem] p-24 text-center border border-dashed border-outline-variant/30 flex flex-col items-center">
          <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant opacity-40">favorite</span>
          </div>
          <h2 className="text-2xl font-black text-on-surface mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Chưa có sân yêu thích</h2>
          <p className="text-on-surface-variant font-bold opacity-50 mb-8 max-w-sm">Hãy khám phá các cụm sân và nhấn yêu thích để lưu lại những địa điểm bạn thích nhất.</p>
          <Link href="/fields" className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2">
            Khám phá ngay <span className="material-symbols-outlined text-[20px]">explore</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map(venue => (
            <VenueCard key={venue._id} venue={venue} href={`/user/book/${venue._id}`} />
          ))}
        </div>
      )}
    </main>
  );
}
