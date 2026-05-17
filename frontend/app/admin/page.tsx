"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardData {
  totalUsers?: number;
  totalOwners?: number;
  totalVenues?: number;
  totalBookings?: number;
  totalRevenue?: number;
  totalPlatformFee?: number;
  uncollectedCommission?: number;
}

const fmt = (n?: number) => {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("vi-VN");
};

const fmtVND = (n?: number) => {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B ₫`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
};

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    fetch("http://localhost:5000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => setData(json?.data ?? json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const Skeleton = () => (
    <div className="bg-surface-container-lowest p-8 rounded-xl animate-pulse">
      <div className="h-3 bg-surface-container rounded mb-4 w-1/2" />
      <div className="h-10 bg-surface-container rounded w-2/3" />
    </div>
  );

  return (
    <div className="p-6 lg:p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <p className="text-on-surface-variant font-medium text-sm mb-1 uppercase tracking-wider">Tổng quan Super Admin</p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary">Dashboard</h2>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full">
          {loading
            ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            : <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          }
          <span className="font-medium text-sm text-on-surface">{loading ? "Đang tải..." : "Trạng thái hệ thống: Ổn định"}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Top Metrics */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? <><Skeleton /><Skeleton /><Skeleton /></> : (
            <>
              {[
                { icon: "group", label: "Tổng người dùng", value: fmt(data?.totalUsers), color: "text-primary" },
                { icon: "storefront", label: "Tổng đối tác", value: fmt(data?.totalOwners), color: "text-primary" },
                { icon: "book_online", label: "Đơn đặt sân toàn sàn", value: fmt(data?.totalBookings), color: "text-primary" },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group border border-outline-variant/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,62,199,0.06)] transition-all duration-300">
                  <div className="absolute top-0 right-0 p-6 opacity-25 group-hover:opacity-40 transition-opacity">
                    <span className={`material-symbols-outlined text-6xl ${s.color}`}>{s.icon}</span>
                  </div>
                  <p className="text-on-surface-variant font-medium text-sm mb-2">{s.label}</p>
                  <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tight">{s.value}</h3>
                  <div className="mt-4 flex items-center gap-2 text-secondary font-medium text-sm">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>Dữ liệu trực tuyến</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Quick Actions - Placed here in DOM so it sits in the right column spanning 2 rows */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/10 shadow-[0_12px_60px_rgba(25,27,37,0.02)] p-8 rounded-xl lg:row-span-2 flex flex-col">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Thao tác nhanh</h3>
          <div className="flex flex-col gap-4 flex-grow">
            {[
              { href: "/admin/users", icon: "manage_accounts", color: "text-primary bg-primary/15 group-hover:bg-primary/25", label: "Quản lý Người dùng", sub: `${fmt(data?.totalUsers)} người dùng` },
              { href: "/admin/revenue", icon: "payments", color: "text-[#10b981] bg-[#10b981]/10 group-hover:bg-[#10b981]/20", label: "Quản lý Doanh thu", sub: `Phí sàn: ${fmtVND(data?.totalPlatformFee)}` },
              { href: "/admin/add-partner", icon: "person_add", color: "text-blue-600 bg-blue-500/10 group-hover:bg-blue-500/20", label: "Thêm Đối tác mới", sub: "Thêm chủ sân vào hệ thống" },
              { href: "/admin/settings", icon: "settings", color: "text-on-surface bg-surface-container-high group-hover:bg-outline/20", label: "Cài đặt hệ thống", sub: "Môn thể thao & cấu hình" },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer group border border-outline-variant/5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${item.color}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-headline font-bold text-sm text-on-surface">{item.label}</h4>
                  <p className="text-xs text-on-surface-variant">{item.sub}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward_ios</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/10 shadow-[0_12px_60px_rgba(25,27,37,0.04)] p-8 rounded-xl">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Tổng quan nền tảng</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow border border-outline-variant/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Tổng số cụm sân</p>
                  <p className="text-3xl font-headline font-black text-on-surface">{fmt(data?.totalVenues)}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow border border-outline-variant/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#10b981] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Tổng doanh thu sân</p>
                  <p className="text-3xl font-headline font-black text-on-surface">{fmtVND(data?.totalRevenue)}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow border border-outline-variant/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Phí dịch vụ thu (5%)</p>
                  <p className="text-3xl font-headline font-black text-primary">{fmtVND(data?.totalPlatformFee)}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow border border-outline-variant/10 p-6 rounded-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ef4444] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Công nợ cần thu</p>
                  <p className="text-3xl font-headline font-black text-[#ef4444]">{fmtVND(data?.uncollectedCommission)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
