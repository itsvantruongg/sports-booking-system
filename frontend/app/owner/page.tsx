"use client";
import Link from "next/link";

export default function OwnerPage() {
  return (
    <div className="p-8 lg:p-12">
{/* Header */}
<header className="flex justify-between items-end mb-12">
<div>
<p className="text-on-surface-variant font-body text-lg mb-1">September 24, 2023</p>
<h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-on-surface">Good morning, Facility Admin</h2>
</div>
<div className="hidden md:flex gap-4">
<button className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<img alt="Admin Avatar" className="w-12 h-12 rounded-full object-cover" data-alt="Close up portrait of a professional man in a modern office environment with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANeNqG4QmDBC9VkJRFjiGBpvZZwEUAAQ7SEncF3AqwFBmnWHlHZZhV9ACliA0VsKgApqhGwv26aoiB3Tx0I17HIe2XwcRnng7Kj3bo8cLnVM-9woZrNoslRlsHHC8e-ivZr5fvK6xwASHKNs_FjeSYQYgp5g6uCuZG7hZGs7Tv17oEOu7JqNtGhcSo2M8q1kazZ4IFaW6Sk1RY8eagOPyeNcW9C2NI5axKjfeclFfgXlhEFHkudaMjtoS6gn3AVXa_2UGaPz8rgZg" />
</div>
</header>
{/* Quick Stats Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
{/* Stat Card 1 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-8xl text-primary">sports_tennis</span>
</div>
<h3 className="text-on-surface-variant font-body font-medium mb-2">Today's Bookings</h3>
<div className="flex items-baseline gap-3">
<span className="text-5xl font-black font-display tracking-tighter text-on-surface">142</span>
<span className="text-secondary font-body font-semibold text-sm flex items-center"><span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12%</span>
</div>
<p className="text-sm text-on-surface-variant mt-4 font-body">24 courts active across 3 venues</p>
</div>
{/* Stat Card 2 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-8xl text-secondary">payments</span>
</div>
<h3 className="text-on-surface-variant font-body font-medium mb-2">Estimated Revenue</h3>
<div className="flex items-baseline gap-3">
<span className="text-5xl font-black font-display tracking-tighter text-on-surface">$4,850</span>
<span className="text-secondary font-body font-semibold text-sm flex items-center"><span className="material-symbols-outlined text-sm mr-1">trending_up</span> +8%</span>
</div>
<p className="text-sm text-on-surface-variant mt-4 font-body">Expected total by end of day</p>
</div>
{/* Stat Card 3 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-8xl text-tertiary">pie_chart</span>
</div>
<h3 className="text-on-surface-variant font-body font-medium mb-2">Occupancy Rate</h3>
<div className="flex items-baseline gap-3">
<span className="text-5xl font-black font-display tracking-tighter text-on-surface">85%</span>
<span className="text-on-surface-variant font-body font-medium text-sm">Peak Hours</span>
</div>
{/* Progress Bar */}
<div className="w-full bg-surface-container-high rounded-full h-2.5 mt-6">
<div className="bg-gradient-to-r from-primary to-primary-container h-2.5 rounded-full" style={{ width: "85%" }}></div>
</div>
</div>
</div>
{/* Asymmetric Content Area */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
{/* Left Column: Recent Bookings (Larger span) */}
<div className="xl:col-span-2 space-y-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Recent Bookings</h3>
<a href="/owner/courts" className="text-primary font-headline font-semibold text-sm hover:underline" style={{ display: "block", textAlign: "center" }}>View All</a>
</div>
<div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden">
{/* Booking List Item 1 */}
<div className="flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors group cursor-pointer border-b border-surface-variant/20 last:border-0">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary group-hover:bg-white transition-colors">
<span className="material-symbols-outlined">sports_tennis</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Downtown Padel - Court 2</h4>
<p className="text-sm text-on-surface-variant font-body">Today, 18:00 - 19:30 • Sarah Jenkins</p>
</div>
</div>
<div className="flex items-center gap-6">
<div className="text-right">
<p className="font-headline font-bold text-on-surface">$45.00</p>
<span className="inline-flex items-center gap-1 text-xs font-semibold text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full mt-1">
<span className="material-symbols-outlined text-[10px]">check_circle</span> Paid
                                </span>
</div>
<button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
{/* Booking List Item 2 */}
<div className="flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors group cursor-pointer border-b border-surface-variant/20 last:border-0">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary group-hover:bg-white transition-colors">
<span className="material-symbols-outlined">sports_tennis</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Downtown Padel - Court 1</h4>
<p className="text-sm text-on-surface-variant font-body">Today, 19:30 - 21:00 • Michael Chang</p>
</div>
</div>
<div className="flex items-center gap-6">
<div className="text-right">
<p className="font-headline font-bold text-on-surface">$60.00</p>
<span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full mt-1">
<span className="material-symbols-outlined text-[10px]">schedule</span> Pending
                                </span>
</div>
<button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
{/* Booking List Item 3 */}
<div className="flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors group cursor-pointer border-b border-surface-variant/20 last:border-0">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary group-hover:bg-white transition-colors">
<span className="material-symbols-outlined">sports_basketball</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Westside Arena - Main Court</h4>
<p className="text-sm text-on-surface-variant font-body">Tomorrow, 08:00 - 10:00 • Kinetic League</p>
</div>
</div>
<div className="flex items-center gap-6">
<div className="text-right">
<p className="font-headline font-bold text-on-surface">$120.00</p>
<span className="inline-flex items-center gap-1 text-xs font-semibold text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full mt-1">
<span className="material-symbols-outlined text-[10px]">check_circle</span> Paid
                                </span>
</div>
<button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
{/* Right Column: Venue Summary */}
<div className="xl:col-span-1 space-y-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-2xl font-bold font-display text-on-surface tracking-tight">Venue Status</h3>
</div>
{/* Venue Card 1 */}
<div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden">
<div className="h-32 bg-surface-container relative">
<img alt="Padel Court" className="w-full h-full object-cover" data-alt="High angle shot of a modern blue padel court outdoors under bright sunny sky with sharp shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClKS3wIBPnR_DvJryFsW1E-N_MV5geFYJHIBtAjHCIJlnaLNNSDg_d08rrMh6JLheOxtlnQT2q8l0qgYbOYN3HcJqm94hHfwQ62PLFe2c8XxhbuIaBGSaA1qrbje9JDXMEQM8-xn0TXINiC5h4YjVOwuc2DxplcoiRYZ0auhSVwT06iXOJiERsHMij_r7lBrNj2re4HCzY4rBmfuo_8QhPu64jhnK1sqEinSLDeNtn0vvPFQ8kvdmATADpRnS9zUb2JIBom-NJY1g" />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-4 left-4">
<h4 className="text-white font-display font-bold text-lg">Downtown Padel</h4>
<p className="text-white/80 font-body text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> City Center</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-center mb-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-sm font-semibold font-body text-on-surface">Active</span>
</div>
<span className="text-sm font-body text-on-surface-variant">8/10 Courts in use</span>
</div>
<a href="/owner/courts" className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary font-headline font-semibold rounded-lg transition-colors text-sm" style={{ display: "block", textAlign: "center" }}>Manage Venue</a>
</div>
</div>
{/* Venue Card 2 */}
<div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden">
<div className="h-32 bg-surface-container relative">
<img alt="Basketball Arena" className="w-full h-full object-cover" data-alt="Wide shot of a polished indoor basketball court with dramatic overhead lighting and empty bleachers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANXQ7Gckuf8Z-6wWEGbdhQD1RSAaMCTvnW3jfa0MNrqsmHVrfiakJsE7qhzjiq_i4LXwIPYFIdfijPpL74twXgz87QcYRV7H-4klU3PxIxJQzKurdlQyQtDhycoESKyGGmkM09e0kMMzS_cEP4Njtz4iWCqS3-Dn_bb2R7oRzCZI6mhqQyU6Lv_h-NKRDlI22oKOcpcPdYteYEtYnwGund5Fr5-wv7ZlzKwLMopiLzy51OWXJg_9QTCR0f_dnc9hwBFaKdPz45IGk" />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-4 left-4">
<h4 className="text-white font-display font-bold text-lg">Westside Arena</h4>
<p className="text-white/80 font-body text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> West District</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-center mb-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-sm font-semibold font-body text-on-surface">Maintenance</span>
</div>
<span className="text-sm font-body text-on-surface-variant">2/4 Courts in use</span>
</div>
<a href="/owner/courts" className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary font-headline font-semibold rounded-lg transition-colors text-sm" style={{ display: "block", textAlign: "center" }}>Manage Venue</a>
</div>
</div>
</div>
</div>
    </div>
  );
}
