"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.replace("/login");
    }
  }, [pathname]);

  // Certain pages might want to hide the global navbar/footer if they handle it themselves
  // But for now, we want a consistent experience.
  
  const isPaymentPage = pathname === "/user/payment";
  
  if (isPaymentPage) {
    return <div className="min-h-screen bg-surface-container-lowest text-on-surface">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {children}
      </div>

      <Footer />

      {/* Mobile Bottom Navigation - Kept for mobile UX */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant/10 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { href: "/user",           icon: "home",          label: "Khám phá" },
            { href: "/fields",         icon: "search",        label: "Tìm sân" },
            { href: "/user/favorites", icon: "favorite",      label: "Yêu thích" },
            { href: "/user/history",   icon: "receipt_long",  label: "Đơn đặt" },
            { href: "/user/profile",   icon: "person",        label: "Hồ sơ" },
          ].map(({ href, icon, label }) => {
            const isActive = mounted && (pathname === href || (href !== "/user" && pathname.startsWith(href)));
            return (
              <Link key={href} href={href} className={`flex flex-col items-center gap-1 px-3 transition-all ${isActive ? "text-primary" : "text-on-surface-variant/60"}`}>
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-on-surface-variant/60"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
