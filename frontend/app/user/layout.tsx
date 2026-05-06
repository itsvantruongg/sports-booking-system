"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/user",         label: "Explore" },
  { href: "/user/history", label: "My Bookings" },
  { href: "/user/fields",  label: "Venues" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#191b25]">
      <header className="sticky top-0 z-50 bg-[#fbf8ff]/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/user" className="text-2xl font-black tracking-tighter text-[#003ec7]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              KINETIC
            </Link>
            <nav className="hidden md:flex gap-6 font-bold tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}
                  className={pathname === href || (href !== "/user" && pathname.startsWith(href))
                    ? "text-[#003ec7] border-b-2 border-[#003ec7] pb-1"
                    : "text-[#434656] hover:text-[#003ec7] transition-colors"}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#003ec7] hover:bg-[#ededfb] rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link href="/user/profile" className="p-2 text-[#003ec7] hover:bg-[#ededfb] rounded-full transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <Link href="/user/fields" className="bg-[#003ec7] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0052ff] transition-all shadow-md" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Find a Court
            </Link>
          </div>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
