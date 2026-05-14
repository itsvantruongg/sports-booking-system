"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/owner/customers", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [router]);

  const exportCustomersCSV = () => {
    const headers = ["Tên khách hàng", "Email", "Số điện thoại", "Tổng lượt đặt", "Tổng chi tiêu (VNĐ)"];
    const rows = customers.map((c: any) => [
      c.user?.name ?? "N/A",
      c.user?.email ?? "N/A",
      c.user?.phone ?? "N/A",
      c.booking_count ?? 0,
      c.total_spent ?? 0,
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinetic_customers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 lg:p-12 xl:p-16 max-w-[1600px] w-full">
{/* Header Section */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-background mb-2">Danh sách Khách hàng</h2>
<p className="text-on-surface-variant text-lg max-w-2xl">Quản lý và tương tác với khách hàng đã đặt sân của bạn.</p>
</div>
<div className="flex items-center gap-4 shrink-0">
<button
  onClick={exportCustomersCSV}
  disabled={loading || customers.length === 0}
  className="bg-primary text-on-primary hover:shadow-lg transition-all rounded-full py-3 px-6 flex items-center gap-2 font-bold text-sm disabled:opacity-50">
<span className="material-symbols-outlined text-[16px]">download</span>
                    Xuất CSV
                </button>
</div>
</header>
{/* Search & Filter Controls */}
<div className="bg-surface-container-lowest rounded-xl p-4 mb-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col lg:flex-row gap-4 items-center">
{/* Search */}
<div className="relative flex-1 w-full group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" data-icon="search">search</span>
<input className="w-full bg-surface-container-low border-2 border-transparent focus:border-surface-variant/30 focus:bg-surface-bright focus:ring-0 rounded-lg py-3 pl-12 pr-4 text-on-background placeholder:text-outline transition-all" placeholder="Tìm kiếm theo tên, email..." type="text" />
</div>
</div>

{/* Data Table (Bento Style Rows) */}
<div className="space-y-4">
{/* Table Header (Visual Only) */}
<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
<div className="col-span-4 lg:col-span-3">Khách hàng</div>
<div className="col-span-4 lg:col-span-4">Thông tin liên hệ</div>
<div className="col-span-2 text-center">Tổng số lần đặt</div>
<div className="col-span-2 text-right">Tổng chi tiêu</div>
</div>

{loading ? (
  <div className="text-center py-10 text-on-surface-variant">Đang tải danh sách khách hàng...</div>
) : customers.length === 0 ? (
  <div className="text-center py-10 text-on-surface-variant bg-surface-container-lowest rounded-lg">Chưa có khách hàng nào đặt sân của bạn.</div>
) : (
  customers.map((c, index) => (
    <div key={index} className="bg-surface-container-lowest rounded-lg p-4 md:p-6 shadow-[0_8px_30px_rgba(25,27,37,0.03)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10">
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
    {/* Customer Name & Avatar */}
    <div className="col-span-4 lg:col-span-3 flex items-center gap-4 w-full">
    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline font-bold text-lg">
      {c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'U'}
    </div>
    <div>
    <h3 className="font-headline font-bold text-on-background group-hover:text-primary transition-colors">{c.user?.name || 'Khách hàng'}</h3>
    <p className="text-xs text-on-surface-variant">Tham gia {new Date(c.user?.created_at).toLocaleDateString('vi-VN')}</p>
    </div>
    </div>
    {/* Contact Info */}
    <div className="col-span-4 lg:col-span-4 flex flex-col justify-center w-full mt-2 md:mt-0">
    <div className="flex items-center gap-2 text-sm text-on-background">
    <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
        {c.user?.email || 'N/A'}
    </div>
    <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
    <span className="material-symbols-outlined text-[16px] text-outline">phone</span>
        {c.user?.phone || 'N/A'}
    </div>
    </div>
    {/* Total Bookings */}
    <div className="col-span-2 flex justify-center items-center w-full mt-4 md:mt-0">
    <div className="flex flex-col items-center">
    <span className="font-headline font-extrabold text-2xl text-primary">{c.booking_count}</span>
    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Lượt đặt</span>
    </div>
    </div>
    {/* Status / Spent */}
    <div className="col-span-2 flex justify-end items-center w-full mt-4 md:mt-0 text-right">
      <div className="flex flex-col items-end">
        <span className="font-headline font-extrabold text-lg text-on-background">{c.total_spent.toLocaleString('vi-VN')} ₫</span>
      </div>
    <button className="ml-4 text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined">more_vert</span>
    </button>
    </div>
    </div>
    </div>
  ))
)}

</div>
    </div>
  );
}
