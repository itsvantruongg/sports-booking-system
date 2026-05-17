"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/owner", label: "Bảng điều khiển", icon: "dashboard" },
  { href: "/owner/bookings", label: "Đơn đặt sân", icon: "book_online" },
  { href: "/owner/courts", label: "Quản lý sân", icon: "stadium" },
  { href: "/owner/pricing", label: "Quản lý giá", icon: "price_change" },
  { href: "/owner/timeline", label: "Lịch trình", icon: "calendar_today" },
  { href: "/owner/revenue", label: "Doanh thu", icon: "payments" },
  { href: "/owner/customers", label: "Khách hàng", icon: "group" },
  { href: "/owner/vouchers", label: "Voucher", icon: "confirmation_number" },
  { href: "/owner/payment-settings", label: "Cài đặt thanh toán", icon: "settings_suggest" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/owner/change-password') {
    return <>{children}</>;
  }

  // Role Guard: Đảm bảo chỉ Owner mới được vào trang này
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    
    if (!token || (role && role !== 'OWNER')) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf8ff]">
      <nav className="h-screen w-72 bg-[#f3f2ff] shadow-[20px_0_60px_rgba(25,27,37,0.04)] flex flex-col p-6 fixed left-0 top-0 z-40">
        <div className="mb-8">
          <Link href="/owner">
            <p className="text-xl font-black text-[#003ec7] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kinetic HQ</p>
            <p className="text-sm text-[#434656]">Dành cho Đối tác</p>
          </Link>
        </div>
        <ul className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar pr-2">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link href={href} className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-[13px] transition-all duration-300 ${active ? "bg-[#003ec7] text-white shadow-[0_10px_25px_-5px_rgba(0,62,199,0.3)]" : "text-[#434656] hover:bg-[#e7e7f5] hover:text-[#003ec7]"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <Link href="/owner/courts" className="w-full bg-[#003ec7] text-white font-bold py-3 px-4 rounded-full hover:bg-[#0052ff] transition-colors shadow-md text-sm mb-4 text-center block" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Thêm sân mới
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-[#434656] hover:bg-[#e7e7f5] rounded-full font-semibold text-sm transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>Đăng xuất
          </button>
        </div>
      </nav>
      <main className="ml-72 flex-1 overflow-y-auto bg-[#fbf8ff]">{children}</main>
    </div>
  );
}