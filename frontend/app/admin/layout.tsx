"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin",              label: "Dashboard",   icon: "dashboard" },
  { href: "/admin/courts",       label: "Venues",      icon: "stadium" },
  { href: "/admin/users",        label: "Users",       icon: "group" },
  { href: "/admin/settings",     label: "Sport Types", icon: "sports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf8ff]">
      <nav className="h-screen w-72 bg-[#f3f2ff] shadow-[20px_0_60px_rgba(25,27,37,0.04)] flex flex-col p-6 fixed left-0 top-0 z-40">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003ec7] text-white rounded-full flex items-center justify-center font-black text-lg">K</div>
          <div>
            <Link href="/admin">
              <p className="text-xl font-black text-[#191b25] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kinetic HQ</p>
              <p className="text-xs text-[#434656]">Admin Portal</p>
            </Link>
          </div>
        </div>
        <Link href="/admin/add-partner" className="w-full bg-[#003ec7] text-white font-bold py-3 px-4 rounded-full hover:bg-[#0052ff] transition-colors shadow-md text-sm mb-6 flex items-center justify-center gap-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          <span className="material-symbols-outlined text-sm">add</span>Add Partner
        </Link>
        <ul className="flex flex-col gap-2 flex-grow">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${active ? "bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white shadow-lg" : "text-[#434656] hover:bg-[#e7e7f5] hover:translate-x-1"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <span className="material-symbols-outlined">{icon}</span>{label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-[#434656] hover:bg-[#e7e7f5] rounded-full font-semibold text-sm transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>Sign Out
          </button>
        </div>
      </nav>
      <main className="ml-72 flex-1 overflow-y-auto bg-[#fbf8ff]">{children}</main>
    </div>
  );
}
