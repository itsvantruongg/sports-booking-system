"use client";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Venue {
  _id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  status: string;
  avg_rating: number;
  images: { url: string }[];
  sport_type?: { name: string };
}

interface VenueCardProps {
  venue: Venue;
  href?: string;
}

export default function VenueCard({ venue, href }: VenueCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const linkHref = href || `/fields/${venue._id}`;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    // We could fetch all favorites once in parent, but for simplicity here:
    fetch(`http://localhost:5000/api/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res.data ?? []);
        setIsFavorite(list.some((v: any) => (v._id || v) === venue._id));
      })
      .catch(() => {});
  }, [venue._id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await fetch(`http://localhost:5000/api/users/favorites/${venue._id}`, {
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
          body: JSON.stringify({ venue_id: venue._id }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(25,27,37,0.02)] hover:shadow-[0_20px_60px_rgba(25,27,37,0.08)] transition-all duration-300 group flex flex-col h-full border border-outline-variant/5 relative">
      <div className="relative h-60 overflow-hidden bg-surface-container">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={venue.images?.[0]?.url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"}
          alt={venue.name}
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-sm ${
          venue.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          {venue.status === "ACTIVE" ? "Hoạt động" : "Bảo trì"}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          disabled={favLoading}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-md flex items-center justify-center text-red-500 hover:scale-110 transition-all z-10"
        >
          {favLoading ? (
            <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
              {isFavorite ? "favorite" : "favorite_border"}
            </span>
          )}
        </button>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <StarRating rating={venue.avg_rating} showCount={false} />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          {venue.sport_type?.name && (
            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-widest border border-primary/20">
              {venue.sport_type.name}
            </span>
          )}
          <h3 className="text-xl font-black text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <p className="text-on-surface-variant text-sm mb-4 flex items-start gap-1.5 opacity-80">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            <span className="line-clamp-2 leading-relaxed">
              {venue.address || `${venue.district}, ${venue.city}`}
            </span>
          </p>
        </div>
        
        <div className="pt-5 border-t border-surface-variant/30 mt-2">
          <Link 
            href={linkHref} 
            className="w-full bg-surface-container-high hover:bg-primary text-on-surface hover:text-on-primary font-black py-3 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm group/btn"
          >
            Chi tiết 
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
