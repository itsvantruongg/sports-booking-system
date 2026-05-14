"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  searchText?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: () => void;
}

interface Notification {
  _id: string;
  message: string;
  type: string;
  is_read: boolean;
  createdAt: string;
}

export default function Navbar({ searchText, onSearchChange, onSearchSubmit }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    if (token) fetchNotifications();
  }, [pathname]);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
        setUnreadCount((Array.isArray(data) ? data : []).filter((n: any) => !n.is_read).length);
      }
    } catch { /* Fail silently */ }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowNotifPanel(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    router.push("/");
  };

  const markAllRead = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* Fail silently */ }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            KINETIC
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/fields" className={`text-sm font-bold transition-colors ${pathname === '/fields' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Sân bãi</Link>
            {isLoggedIn && (
              <>
                <Link href="/user/history" className={`text-sm font-bold transition-colors ${pathname === '/user/history' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Lịch đặt</Link>
                <Link href="/user/favorites" className={`text-sm font-bold transition-colors ${pathname === '/user/favorites' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Yêu thích</Link>
              </>
            )}
          </nav>
        </div>

        {/* Search bar in header */}
        {onSearchChange && (
          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-5 py-2 gap-2 w-full max-w-md border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/20 transition-all mx-4">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearchSubmit?.()}
              placeholder="Tìm sân, khu vực..."
              className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-outline"
            />
            {searchText && (
              <button onClick={() => onSearchChange("")} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-on-surface-variant font-bold hover:text-primary transition-colors text-sm px-2">Đăng nhập</Link>
              <Link href="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold hover:shadow-lg transition-all text-sm">Đăng ký</Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              {/* Notifications */}
              <div className="relative" ref={panelRef}>
                <button 
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  className={`p-2.5 rounded-full transition-all ${showNotifPanel ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  <span className="material-symbols-outlined relative" style={{ fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>
                    notifications
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-surface rounded-full"></span>}
                  </span>
                </button>
                {showNotifPanel && (
                  <div className="absolute right-0 mt-4 w-80 md:w-96 bg-surface-container-low border border-outline-variant/20 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container">
                      <h3 className="font-black text-sm">Thông báo</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline">Đánh dấu đã đọc</button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-12 text-center text-on-surface-variant/40">
                          <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                          <p className="text-xs font-bold">Không có thông báo mới</p>
                        </div>
                      ) : (
                        notifications.map((n: any) => (
                          <div key={n._id} className={`p-5 border-b border-outline-variant/5 flex gap-4 transition-colors ${!n.is_read ? 'bg-primary/5' : 'hover:bg-surface-container-highest/50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-outline'}`}>
                              <span className="material-symbols-outlined text-sm">notifications</span>
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm leading-relaxed mb-1 ${!n.is_read ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>{n.title}</p>
                              <p className={`text-xs mb-1 ${!n.is_read ? 'text-on-surface' : 'text-on-surface-variant opacity-70'}`}>{n.body}</p>
                              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-surface-container border border-outline-variant/20 hover:border-primary/50 transition-all"
                >
                  <span className="material-symbols-outlined text-outline">account_circle</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-4 w-56 bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span> Trang cá nhân
                    </Link>
                    <Link href="/user/history" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span> Lịch sử đặt sân
                    </Link>
                    <div className="h-px bg-outline-variant/10 my-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">logout</span> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
