"use client";
import Link from "next/link";

export default function OwnerCourtsPage() {
  return (
    <div className="p-6 lg:p-12">
{/* Header */}
<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
<div>
<h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-2">Court Management</h1>
<p className="text-lg text-on-surface-variant font-body">Manage your active venues, rates, and availability schedules.</p>
</div>
<div className="flex gap-4 w-full md:w-auto">
<div className="relative flex-1 md:w-64">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg font-body focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-colors" placeholder="Search courts..." type="text" />
</div>
</div>
</header>
{/* Quick Stats (Bento Layout) */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
{/* Stat Card 1 */}
<div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
<div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
<div className="flex items-center justify-between mb-4 relative z-10">
<h3 className="text-on-surface-variant font-semibold font-body">Active Courts</h3>
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
</div>
</div>
<div className="text-5xl font-display font-bold text-on-surface relative z-10">14</div>
<div className="text-sm text-secondary font-medium mt-2 flex items-center gap-1 relative z-10">
<span className="material-symbols-outlined text-sm">trending_up</span> All venues operational
                </div>
</div>
{/* Stat Card 2 */}
<div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
<div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
<div className="flex items-center justify-between mb-4 relative z-10">
<h3 className="text-on-surface-variant font-semibold font-body">Current Occupancy</h3>
<div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
</div>
</div>
<div className="flex items-baseline gap-2 relative z-10">
<span className="text-5xl font-display font-bold text-on-surface">85</span>
<span className="text-2xl text-on-surface-variant font-medium">%</span>
</div>
<div className="w-full bg-surface-variant h-2 rounded-full mt-4 overflow-hidden relative z-10">
<div className="bg-primary h-full rounded-full" style={{ width: "85%" }}></div>
</div>
</div>
{/* Stat Card 3 */}
<div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
<div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
<div className="flex items-center justify-between mb-4 relative z-10">
<h3 className="text-on-surface-variant font-semibold font-body">Upcoming Bookings</h3>
<div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
</div>
</div>
<div className="text-5xl font-display font-bold text-on-surface relative z-10">42</div>
<div className="text-sm text-on-surface-variant font-medium mt-2 relative z-10">Next 24 hours</div>
</div>
</section>
{/* Court List */}
<section>
<div className="flex justify-between items-center mb-8">
<h2 className="text-2xl font-display font-bold text-on-surface">Active Roster</h2>
<div className="flex gap-2">
<button className="px-4 py-2 bg-surface-container-low text-on-surface font-medium rounded-full hover:bg-surface-container-high transition-colors text-sm flex items-center gap-2">
<span className="material-symbols-outlined text-sm">filter_list</span> Filter
                    </button>
<button className="px-4 py-2 bg-surface-container-low text-on-surface font-medium rounded-full hover:bg-surface-container-high transition-colors text-sm flex items-center gap-2">
<span className="material-symbols-outlined text-sm">sort</span> Sort
                    </button>
</div>
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
{/* Court Card 1 */}
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
<div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden relative flex-shrink-0">
<img alt="Turf Arena A" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="indoor high quality green artificial turf soccer arena under bright stadium lights with clear lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbrRjGH7s7xAhJU-gynFjpOFA0RnEhv_Dlj9X7f7JXOUnFr9gB0ppEj3SY68ctzATtTLneQRORcI7muqgM2y6HTXEpa8xtABI3DNS1RrNxoehylqdekEq_W9CNJ_cHO5M1uzX9lYCd-EIbd98ewbH-sx7EsZ_-6M6kiu9J6JnxUPDV0OY7EjE8Cw-iOa6ttu5dqlhpTQy0ssYMnJxb_2S1rVfuDFaTRnWwuihLoqpr0OW_YTOitJ3qdix6Fn5zopeYtyyZp0EJkBE" />
<div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                        </div>
</div>
<div className="flex flex-col flex-1 justify-between py-2">
<div>
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-display font-bold text-on-surface mb-1">Turf Arena A</h3>
<div className="flex gap-2">
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">Soccer</span>
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">7v7</span>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2">Premium indoor artificial turf field suitable for 7v7 matches. Features high-intensity LED lighting and spectator seating.</p>
</div>
<div className="flex items-end justify-between border-t border-surface-variant pt-4">
<div>
<div className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-wide">Base Rate</div>
<div className="font-display font-bold text-on-surface text-xl">$85<span className="text-sm font-medium text-on-surface-variant font-body">/hr</span></div>
<div className="text-xs text-primary font-medium mt-1">Peak: $120/hr</div>
</div>
<button className="bg-surface-container text-primary font-semibold py-2 px-5 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                                Configure Pricing
                            </button>
</div>
</div>
</div>
{/* Court Card 2 */}
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
<div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden relative flex-shrink-0">
<img alt="Hardcourt 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="vibrant blue indoor basketball hardcourt with polished wooden flooring and natural light pouring through large windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZd1CcRilH3YEw7MYi7hRrfdcOQlApn2iu1_G64E8iFVEzV-bqZGGFUILIljbfz3dXDuz9RyK7osKwdEn6BB3udBjOt6d4H-OMZucyHGLGH6M7n9ckGZFYqAK9kgcaVgRoBE6QLwAxArMlPY-WUucEQwJarhk_d6oSwKk_t9ZgJhxsBI9ABvVqoQeyN92DqI3cy1iz5kz-6VrWkJs8XdI7erKQlicvT8YQTZn1jR6KRgbK5N1HmSxMJvr2jj3wJ5Y_YCh1kjBMkpY" />
<div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                        </div>
</div>
<div className="flex flex-col flex-1 justify-between py-2">
<div>
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-display font-bold text-on-surface mb-1">Hardcourt 1</h3>
<div className="flex gap-2">
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">Basketball</span>
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">FIBA Standard</span>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2">Full-size professional hardwood court. Ideal for competitive matches and team training sessions. Scoreboard included.</p>
</div>
<div className="flex items-end justify-between border-t border-surface-variant pt-4">
<div>
<div className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-wide">Base Rate</div>
<div className="font-display font-bold text-on-surface text-xl">$110<span className="text-sm font-medium text-on-surface-variant font-body">/hr</span></div>
<div className="text-xs text-primary font-medium mt-1">Peak: $150/hr</div>
</div>
<button className="bg-surface-container text-primary font-semibold py-2 px-5 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                                Configure Pricing
                            </button>
</div>
</div>
</div>
{/* Court Card 3 (Maintenance) */}
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col sm:flex-row gap-6 relative group overflow-hidden opacity-80">
<div className="absolute inset-0 bg-surface-variant/20 z-10 pointer-events-none"></div>
<div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden relative flex-shrink-0">
<img alt="Padel Court C" className="w-full h-full object-cover grayscale-[30%]" data-alt="modern outdoor padel tennis court with blue turf and glass walls under bright sunny sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFpzrpHwWz9d8NacgCTbeZvSuBXnnC0-Ur7UYz7M8dmti7sVeZpqSHrpM6RpQmGLMBob30LdAtUhNhcS7-euFR-v9x0aDRe0ltWRqK8kxBwMoX7-cAMGY0iUYAj44jwaV9ZH2xGVIz5WdswXyZx_F8_9pSG2M0HSIMDRGR1aGkt2jXhD19iJkWjwloTaXDUm4eEPt4YN0loS9YukqVMb1wVjz6L1_icU62u2v9-ogaJiB2jLEt0_1TWvzT8lRfMFogosgHpwEo7_k" />
<div className="absolute top-3 left-3 bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider flex items-center gap-1 z-20">
<span className="w-2 h-2 rounded-full bg-error"></span> Maintenance
                        </div>
</div>
<div className="flex flex-col flex-1 justify-between py-2 relative z-20">
<div>
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-display font-bold text-on-surface mb-1">Padel Court C</h3>
<div className="flex gap-2">
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">Padel</span>
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">Outdoor</span>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2">Premium panoramic glass padel court. Currently undergoing routine turf maintenance and glass cleaning.</p>
</div>
<div className="flex items-end justify-between border-t border-surface-variant pt-4">
<div>
<div className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-wide">Base Rate</div>
<div className="font-display font-bold text-on-surface text-xl">$45<span className="text-sm font-medium text-on-surface-variant font-body">/hr</span></div>
<div className="text-xs text-primary font-medium mt-1">Peak: $65/hr</div>
</div>
<button className="bg-surface-container text-primary font-semibold py-2 px-5 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                                Configure Pricing
                            </button>
</div>
</div>
</div>
</div>
</section>
{/* Add padding to bottom for scrolling clearance */}
<div className="h-24"></div>
    </div>
  );
}
