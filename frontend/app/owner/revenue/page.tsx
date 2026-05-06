"use client";
import Link from "next/link";

export default function OwnerRevenuePage() {
  return (
    <div className="p-6 md:p-12 xl:p-16 max-w-[1600px] mx-auto w-full">
{/* Header Section */}
<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
<div>
<h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">Revenue Reports</h1>
<p className="font-body text-lg text-on-surface-variant">Financial overview for Kinetic HQ</p>
</div>
<div className="flex items-center gap-4 w-full md:w-auto">
<div className="relative flex-1 md:flex-none">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_month</span>
<select className="w-full md:w-auto pl-12 pr-10 py-3 bg-surface-container-lowest border-none rounded-full font-body font-medium text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none shadow-sm cursor-pointer hover:bg-surface-bright transition-colors">
<option>Last 30 Days</option>
<option>This Month</option>
<option>Last Quarter</option>
<option>Year to Date</option>
</select>
</div>
<div className="flex bg-surface-container-low rounded-full p-1 shadow-sm">
<button className="px-6 py-2 rounded-full font-headline font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors">Week</button>
<button className="px-6 py-2 rounded-full font-headline font-semibold text-sm bg-surface-container-lowest text-primary shadow-sm transition-colors">Month</button>
<button className="px-6 py-2 rounded-full font-headline font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors">Year</button>
</div>
</div>
</header>
{/* KPI Metrics Grid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
{/* Total Revenue Card */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
<div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-primary/10 rounded-2xl">
<span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
</div>
<span className="inline-flex items-center gap-1 text-secondary font-headline font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">
<span className="material-symbols-outlined text-[16px]">trending_up</span> 12.5%
                    </span>
</div>
<h3 className="font-body text-on-surface-variant font-medium mb-1">Total Revenue</h3>
<p className="font-display text-4xl font-extrabold text-on-surface tracking-tight">$124,500<span className="text-xl text-on-surface-variant font-medium">.00</span></p>
</div>
{/* Avg Booking Value */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
<div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/5 rounded-full blur-3xl group-hover:bg-tertiary-container/10 transition-colors duration-500"></div>
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-tertiary-container/10 rounded-2xl">
<span className="material-symbols-outlined text-tertiary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
</div>
<span className="inline-flex items-center gap-1 text-secondary font-headline font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">
<span className="material-symbols-outlined text-[16px]">trending_up</span> 4.2%
                    </span>
</div>
<h3 className="font-body text-on-surface-variant font-medium mb-1">Avg Booking Value</h3>
<p className="font-display text-4xl font-extrabold text-on-surface tracking-tight">$68<span className="text-xl text-on-surface-variant font-medium">.50</span></p>
</div>
{/* Top Performing Asset */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
<div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-500"></div>
<div className="flex justify-between items-start mb-6">
<div className="p-3 bg-secondary/10 rounded-2xl">
<span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
</div>
</div>
<h3 className="font-body text-on-surface-variant font-medium mb-1">Top Performing Asset</h3>
<p className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-1">Center Court 1</p>
<p className="font-body text-sm text-secondary font-semibold">412 Bookings this month</p>
</div>
</section>
{/* Chart Section */}
<section className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_12px_40px_rgba(25,27,37,0.03)] mb-12">
<div className="flex justify-between items-center mb-8">
<div>
<h2 className="font-headline text-2xl font-bold text-on-surface">Revenue Trend</h2>
<p className="font-body text-on-surface-variant text-sm mt-1">Daily revenue over the selected period</p>
</div>
<button className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
{/* Conceptual Chart Area (Visual Representation) */}
<div className="h-[300px] w-full flex items-end gap-2 relative">
{/* Y-Axis Labels */}
<div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-on-surface-variant font-body pb-8 pr-4 border-r border-outline-variant/20">
<span>$6k</span>
<span>$4k</span>
<span>$2k</span>
<span>$0</span>
</div>
{/* Chart Grid Lines */}
<div className="absolute left-10 right-0 top-0 h-[calc(100%-2rem)] flex flex-col justify-between pointer-events-none">
<div className="w-full border-t border-outline-variant/10"></div>
<div className="w-full border-t border-outline-variant/10"></div>
<div className="w-full border-t border-outline-variant/10"></div>
<div className="w-full border-t border-outline-variant/20"></div>
</div>
{/* Bars (Simulated line chart points using bars/gradients for visual flair without JS) */}
<div className="ml-12 flex-1 flex items-end justify-between h-[calc(100%-2rem)] relative z-10">
<div className="w-full h-1/3 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group">
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-body">$2,100</div>
</div>
<div className="w-full h-1/2 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group mx-1">
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-body">$3,200</div>
</div>
<div className="w-full h-2/5 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group mx-1"></div>
<div className="w-full h-3/5 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group mx-1"></div>
<div className="w-full h-4/5 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group mx-1"></div>
<div className="w-full h-full bg-gradient-to-t from-secondary/40 to-secondary rounded-t-sm hover:from-secondary/60 transition-colors cursor-pointer relative group mx-1">
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-body">$5,800</div>
</div>
<div className="w-full h-3/4 bg-gradient-to-t from-primary/20 to-primary-container rounded-t-sm hover:from-primary/40 transition-colors cursor-pointer relative group mx-1"></div>
</div>
{/* X-Axis Labels */}
<div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-on-surface-variant font-body pt-2">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span className="text-secondary font-bold">Sat</span>
<span>Sun</span>
</div>
</div>
</section>
    </div>
  );
}
