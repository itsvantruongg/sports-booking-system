"use client";
import { useEffect, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#f3f2ff] border-b border-[#e7e7f5] flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#003ec7] shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div>
            <p className="text-sm font-black text-[#003ec7] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kinetic HQ</p>
            <p className="text-[10px] text-[#434656] leading-none">Đối tác</p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#003ec7] flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md">
          A
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] animate-in fade-in"
        />
      )}

      {/* Mobile Drawer Menu */}
      <nav className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-[#f3f2ff] flex flex-col p-6 z-[100] transform transition-transform duration-300 ease-out shadow-2xl ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003ec7] text-white rounded-full flex items-center justify-center font-black text-lg shadow-[0_4px_12px_rgba(0,62,199,0.2)] shrink-0">K</div>
            <div>
              <p className="text-xl font-black text-[#003ec7] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kinetic HQ</p>
              <p className="text-xs text-[#434656] leading-none mt-0.5">Dành cho Đối tác</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-[#e7e7f5] flex items-center justify-center text-[#434656]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <ul className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar pr-2">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link 
                  href={href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-[13px] transition-all duration-300 ${active ? "bg-[#003ec7] text-white shadow-[0_10px_25px_-5px_rgba(0,62,199,0.3)]" : "text-[#434656] hover:bg-[#e7e7f5] hover:text-[#003ec7]"}`} 
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <Link 
            href="/owner/courts" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-[#003ec7] text-white font-bold py-3 px-4 rounded-full hover:bg-[#0052ff] transition-colors shadow-md text-sm mb-4 text-center block" 
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
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

      {/* Desktop Persistent Sidebar */}
      <nav className="hidden lg:flex h-screen w-72 bg-[#f3f2ff] shadow-[20px_0_60px_rgba(25,27,37,0.04)] flex-col p-6 fixed left-0 top-0 z-40">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003ec7] text-white rounded-full flex items-center justify-center font-black text-lg shadow-[0_4px_12px_rgba(0,62,199,0.2)] shrink-0">K</div>
          <div>
            <Link href="/owner">
              <p className="text-xl font-black text-[#003ec7] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kinetic HQ</p>
              <p className="text-xs text-[#434656] leading-none mt-0.5">Dành cho Đối tác</p>
            </Link>
          </div>
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

      {/* Main Content Area */}
      <main className="ml-0 lg:ml-72 pt-16 lg:pt-0 flex-1 overflow-y-auto bg-[#fbf8ff] min-h-screen">
        {children}
      </main>
    </div>
  );
}