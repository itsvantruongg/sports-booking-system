"use client";
import Link from "next/link";

export default function OwnerTimelinePage() {
  return (
    <div className="flex-1 md:flex flex-col overflow-hidden p-6 md:p-8">
{/* Top Action Bar (Mobile Nav & Filters) */}
<header className="flex-shrink-0 px-6 py-6 lg:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface z-10 shadow-sm relative">
<div>
<h1 className="text-3xl font-display font-bold tracking-tight text-on-surface">Timeline</h1>
<p className="text-on-surface-variant font-body mt-1">Thursday, Oct 26</p>
</div>
<div className="flex items-center gap-3 w-full sm:w-auto">
<div className="flex-1 sm:flex-none flex items-center bg-surface-container rounded-full p-1">
<button className="px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label font-medium text-sm">All</button>
<button className="px-4 py-2 rounded-full text-on-surface-variant font-label font-medium text-sm hover:text-primary transition-colors">Soccer</button>
<button className="px-4 py-2 rounded-full text-on-surface-variant font-label font-medium text-sm hover:text-primary transition-colors">Padel</button>
</div>
<div className="flex items-center gap-2">
<button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</header>
{/* Timeline Canvas */}
<div className="flex-1 overflow-auto bg-surface-container-low relative scrollbar-hide p-6 lg:p-12">
<div className="min-w-[1200px] bg-surface rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] overflow-hidden flex flex-col">
{/* Time Header (X-Axis) */}
<div className="flex border-b border-surface-variant bg-surface sticky top-0 z-20">
<div className="w-32 flex-shrink-0 p-4 border-r border-surface-variant flex items-center justify-center bg-surface">
<span className="text-sm font-label text-on-surface-variant font-medium">Courts / Time</span>
</div>
<div className="flex-1 flex">
{/* Hours 06:00 to 24:00 (Simplified for demo, usually loop in JS) */}
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">06:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">07:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">08:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">09:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">10:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">11:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">12:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">13:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">14:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">15:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">16:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">17:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">18:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">19:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">20:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">21:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">22:00</div>
<div className="flex-1 min-w-[60px] p-2 text-center text-xs font-label text-on-surface-variant border-r border-surface-variant/50">23:00</div>
</div>
</div>
{/* Courts List (Y-Axis) & Grid */}
<div className="relative">
{/* Grid Lines Background */}
<div className="absolute inset-0 flex ml-32 pointer-events-none z-0">
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
<div className="flex-1 border-r border-surface-variant/30"></div>
</div>
{/* Court Row 1 (Soccer) */}
<div className="flex border-b border-surface-variant/50 relative z-10 group">
<div className="w-32 flex-shrink-0 p-4 border-r border-surface-variant bg-surface flex flex-col justify-center relative z-20">
<span className="font-display font-semibold text-on-surface">Court 1</span>
<span className="text-xs font-label text-on-surface-variant">Soccer 5v5</span>
</div>
<div className="flex-1 relative h-20 bg-transparent hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => alert('Manual Lock dialog')}>
{/* Bookings */}
<div className="absolute top-2 bottom-2 left-[11%] w-[16%] bg-primary/10 rounded-lg border-l-4 border-primary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-primary truncate">J. Doe - Match</p>
<p className="text-[10px] text-primary/80 truncate">08:00 - 11:00</p>
</div>
<div className="absolute top-2 bottom-2 left-[50%] w-[11%] bg-primary/10 rounded-lg border-l-4 border-primary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-primary truncate">Academy Training</p>
<p className="text-[10px] text-primary/80 truncate">15:00 - 17:00</p>
</div>
</div>
</div>
{/* Court Row 2 (Soccer) */}
<div className="flex border-b border-surface-variant/50 relative z-10 group">
<div className="w-32 flex-shrink-0 p-4 border-r border-surface-variant bg-surface flex flex-col justify-center relative z-20">
<span className="font-display font-semibold text-on-surface">Court 2</span>
<span className="text-xs font-label text-on-surface-variant">Soccer 7v7</span>
</div>
<div className="flex-1 relative h-20 bg-transparent hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => alert('Manual Lock dialog')}>
{/* Bookings */}
<div className="absolute top-2 bottom-2 left-[33%] w-[22%] bg-surface-variant rounded-lg border border-outline-variant p-2 overflow-hidden hover:shadow-md transition-shadow cursor-not-allowed opacity-80" title="Maintenance">
<div className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]" data-icon="build">build</span>
<p className="text-xs font-bold truncate">Maintenance</p>
</div>
<p className="text-[10px] text-on-surface-variant/80 truncate">12:00 - 16:00</p>
</div>
<div className="absolute top-2 bottom-2 left-[72%] w-[11%] bg-primary/10 rounded-lg border-l-4 border-primary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-primary truncate">Evening League</p>
<p className="text-[10px] text-primary/80 truncate">19:00 - 21:00</p>
</div>
</div>
</div>
{/* Court Row 3 (Padel) */}
<div className="flex border-b border-surface-variant/50 relative z-10 group">
<div className="w-32 flex-shrink-0 p-4 border-r border-surface-variant bg-surface flex flex-col justify-center relative z-20">
<span className="font-display font-semibold text-on-surface">Padel 1</span>
<span className="text-xs font-label text-on-surface-variant">Indoor Double</span>
</div>
<div className="flex-1 relative h-20 bg-transparent hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => alert('Manual Lock dialog')}>
{/* Bookings */}
<div className="absolute top-2 bottom-2 left-[5%] w-[8%] bg-secondary/10 rounded-lg border-l-4 border-secondary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-secondary truncate">Private Lesson</p>
<p className="text-[10px] text-secondary/80 truncate">07:00 - 08:30</p>
</div>
<div className="absolute top-2 bottom-2 left-[22%] w-[11%] bg-secondary/10 rounded-lg border-l-4 border-secondary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-secondary truncate">M. Smith</p>
<p className="text-[10px] text-secondary/80 truncate">10:00 - 12:00</p>
</div>
<div className="absolute top-2 bottom-2 left-[61%] w-[8%] bg-secondary/10 rounded-lg border-l-4 border-secondary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-secondary truncate">Open Play</p>
<p className="text-[10px] text-secondary/80 truncate">17:00 - 18:30</p>
</div>
</div>
</div>
{/* Court Row 4 (Padel) */}
<div className="flex border-b border-surface-variant/50 relative z-10 group">
<div className="w-32 flex-shrink-0 p-4 border-r border-surface-variant bg-surface flex flex-col justify-center relative z-20">
<span className="font-display font-semibold text-on-surface">Padel 2</span>
<span className="text-xs font-label text-on-surface-variant">Outdoor</span>
</div>
<div className="flex-1 relative h-20 bg-transparent hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => alert('Manual Lock dialog')}>
{/* Bookings */}
<div className="absolute top-2 bottom-2 left-[44%] w-[16%] bg-secondary/10 rounded-lg border-l-4 border-secondary p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
<p className="text-xs font-bold text-secondary truncate">Tournament QF</p>
<p className="text-[10px] text-secondary/80 truncate">14:00 - 17:00</p>
</div>
</div>
</div>
</div>
</div>
</div>
    </div>
  );
}
