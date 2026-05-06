"use client";
import Link from "next/link";

export default function UserHistoryPage() {
  return (
    <>
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
{/* Left Column: Bookings Area */}
<div className="flex-grow flex flex-col gap-8 w-full lg:w-2/3">
{/* Page Header & Tabs */}
<div className="flex flex-col gap-6">
<div>
<h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-on-surface">My Bookings</h1>
<p className="text-lg text-on-surface-variant mt-2 font-body">Manage your upcoming matches and view your history.</p>
</div>
{/* Custom Tabs */}
<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
<button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-headline font-bold text-sm whitespace-nowrap transition-all shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:bg-surface-container-highest">
                        Upcoming
                    </button>
<button className="px-6 py-3 rounded-full bg-surface text-on-surface-variant font-headline font-semibold text-sm whitespace-nowrap hover:bg-surface-container-low transition-all">
                        Completed
                    </button>
<button className="px-6 py-3 rounded-full bg-surface text-on-surface-variant font-headline font-semibold text-sm whitespace-nowrap hover:bg-surface-container-low transition-all">
                        Cancelled
                    </button>
</div>
</div>
{/* Bookings List (Asymmetrical/Cards) */}
<div className="flex flex-col gap-6">
{/* Booking Card 1 (Upcoming - High Priority) */}
<div className="bg-surface-container-lowest rounded-xl md:rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_12px_40px_rgba(25,27,37,0.06)] group hover:shadow-[0_20px_60px_rgba(25,27,37,0.1)] transition-all duration-300">
{/* Image Area */}
<div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
<img alt="Padel court" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="High quality wide angle shot of a modern blue padel court outdoors under bright sunny sky with glass walls" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvtS3JLPev0Ln34ywImlSI9ReO-_A0sgIVBIb_blFc_XfU9PvTCdEI_RJLr9EtWF1rhpGPx6heQIKq3ZDI-RAsqaRBVFOwepFC2FBuAHjYAYPjwb-CLgcfOHzplD_BlhNy_zR6XyIFS6PpwGGp4V7uFNOcMVxwfbxO_Xp5ldLw6lRO17cEJ_6eEy8ra4bLogOv361dp7CiyLpJn6-JL-NJ62xwg-Z5mMP-O__vkbhRCdOh9U0jzco4-BUtolJ_bNiwW7C3HkqSNgs" />
<div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold font-headline flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">bolt</span>
                            Confirmed
                        </div>
</div>
{/* Content Area */}
<div className="p-6 md:p-8 flex flex-col justify-between flex-grow w-full md:w-2/3 bg-surface-container-lowest">
<div>
<div className="flex justify-between items-start mb-2">
<h3 className="text-2xl font-display font-black tracking-tight text-on-surface">Oasis Padel Club</h3>
<span className="text-lg font-headline font-bold text-primary">$45.00</span>
</div>
<p className="text-on-surface-variant font-body mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">location_on</span>
                                Court 3 - Premium Glass
                            </p>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<div>
<p className="text-xs text-on-surface-variant font-medium">Date</p>
<p className="text-sm font-bold font-headline text-on-surface">Thu, Oct 26</p>
</div>
</div>
<div className="bg-surface-container-low p-3 rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-primary">schedule</span>
<div>
<p className="text-xs text-on-surface-variant font-medium">Time</p>
<p className="text-sm font-bold font-headline text-on-surface">18:00 - 19:30</p>
</div>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-lowest flex items-center justify-center text-xs font-bold text-on-surface-variant">4P</div>
</div>
<div className="flex gap-3 w-full sm:w-auto">
<button className="flex-1 sm:flex-none px-4 py-2 rounded-full font-headline font-bold text-sm border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
                                    Cancel
                                </button>
<button className="flex-1 sm:flex-none px-6 py-2 rounded-full font-headline font-bold text-sm bg-primary text-on-primary bg-gradient-to-br from-primary to-primary-container hover:shadow-lg transition-all">
                                    Manage
                                </button>
</div>
</div>
</div>
</div>
{/* Booking Card 2 */}
<div className="bg-surface-container-lowest rounded-xl md:rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_4px_20px_rgba(25,27,37,0.04)] group hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all duration-300">
{/* Image Area */}
<div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
<img alt="Tennis court" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" data-alt="Overhead shot of a green hard tennis court with white lines and bright sunlight casting shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJV4M0A6DLzGcX2UicHpG2LFSXGTnQvFU_uboqasnUEbWZctDVx0rsAkCpR16CNuqtA5P8G6a-3drkKDFz8xPgGTIaRXM4ZpUEkchtmNMN-_5-Tclg9BQmCk-cKitORo3nWCP5ZmFpM_b92FDCo1BFlvcQAS_JZcNtdEUJO0LwBzXoJkRuZqpeDPQfuIlmFXSINKgUkgpX9MzngOz5KsYj9x6n_UgpDoHN8FDhzR3UjuvkW49AA2V38n3yb1bboFOPJcGDC-6OGps" />
<div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md text-on-surface px-3 py-1 rounded-full text-xs font-bold font-headline flex items-center gap-1 shadow-sm">
                            Upcoming
                        </div>
</div>
{/* Content Area */}
<div className="p-6 md:p-8 flex flex-col justify-between flex-grow w-full md:w-2/3 bg-surface-container-lowest">
<div>
<div className="flex justify-between items-start mb-2">
<h3 className="text-2xl font-display font-bold tracking-tight text-on-surface">Downtown Tennis Center</h3>
<span className="text-lg font-headline font-bold text-primary">$30.00</span>
</div>
<p className="text-on-surface-variant font-body mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">location_on</span>
                                Court 1 - Hard Court
                            </p>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<div>
<p className="text-xs text-on-surface-variant font-medium">Date</p>
<p className="text-sm font-bold font-headline text-on-surface">Sat, Oct 28</p>
</div>
</div>
<div className="bg-surface-container-low p-3 rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-primary">schedule</span>
<div>
<p className="text-xs text-on-surface-variant font-medium">Time</p>
<p className="text-sm font-bold font-headline text-on-surface">09:00 - 10:30</p>
</div>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-lowest flex items-center justify-center text-xs font-bold text-on-surface-variant">2P</div>
</div>
<div className="flex gap-3 w-full sm:w-auto">
<button className="flex-1 sm:flex-none px-4 py-2 rounded-full font-headline font-bold text-sm border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
                                    Cancel
                                </button>
<button className="flex-1 sm:flex-none px-6 py-2 rounded-full font-headline font-bold text-sm bg-surface-container text-primary hover:bg-surface-container-high transition-all">
                                    Manage
                                </button>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Right Column: Sidebar Summary */}
<div className="w-full lg:w-1/3 flex flex-col gap-6">
{/* Summary Widget (Glassmorphism/Floating vibe) */}
<div className="bg-surface-container-low rounded-xl p-8 sticky top-32">
<h3 className="text-xl font-display font-black tracking-tight text-on-surface mb-6">Monthly Summary</h3>
<div className="flex flex-col gap-6">
{/* Stat 1 */}
<div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">timer</span>
</div>
<div>
<p className="text-sm text-on-surface-variant font-medium">Total Hours Played</p>
<p className="text-2xl font-headline font-black text-on-surface">12.5 <span className="text-sm font-medium text-on-surface-variant">hrs</span></p>
</div>
</div>
</div>
{/* Stat 2 */}
<div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
</div>
<div>
<p className="text-sm text-on-surface-variant font-medium">Upcoming Sessions</p>
<p className="text-2xl font-headline font-black text-on-surface">3</p>
</div>
</div>
</div>
</div>
<div className="mt-8 pt-6 border-t border-outline-variant/20">
<button className="w-full py-3 rounded-full font-headline font-bold text-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        View Full History
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
      </main>
    </>
  );
}
