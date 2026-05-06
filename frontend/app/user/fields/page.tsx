"use client";
import Link from "next/link";

export default function UserFieldsPage() {
  return (
    <>
      <main className="pt-28 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
{/* Sidebar Filters */}
<aside className="w-full md:w-80 flex-shrink-0">
<div className="bg-surface-container-low rounded-xl p-8 sticky top-32">
<h2 className="text-headline-lg mb-8">Filters</h2>
{/* Sport Type */}
<div className="mb-8">
<h3 className="text-title-md mb-4 text-on-surface-variant">Sport Type</h3>
<div className="flex flex-wrap gap-3">
<button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-medium">Football</button>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-full text-sm font-medium hover:bg-surface-variant transition-colors">Basketball</button>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-full text-sm font-medium hover:bg-surface-variant transition-colors">Tennis</button>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-full text-sm font-medium hover:bg-surface-variant transition-colors">Padel</button>
</div>
</div>
{/* Location */}
<div className="mb-8">
<h3 className="text-title-md mb-4 text-on-surface-variant">Location</h3>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">location_on</span>
<input className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all text-body-lg" placeholder="Search areas..." type="text" />
</div>
</div>
{/* Price Range */}
<div className="mb-8">
<h3 className="text-title-md mb-4 text-on-surface-variant">Price Range</h3>
<input className="w-full accent-primary" max="100" min="0" type="range" />
<div className="flex justify-between text-sm text-on-surface-variant mt-2">
<span>$0</span>
<span>$100+</span>
</div>
</div>
{/* Time Slots */}
<div className="mb-8">
<h3 className="text-title-md mb-4 text-on-surface-variant">Time</h3>
<div className="grid grid-cols-2 gap-3">
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors">Morning</button>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors">Afternoon</button>
<button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg text-sm font-medium">Evening</button>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors">Night</button>
</div>
</div>
<button className="w-full btn-primary mt-4">Apply Filters</button>
</div>
</aside>
{/* Fields Grid */}
<div className="flex-1">
<div className="flex justify-between items-end mb-8">
<div>
<h1 className="text-display-lg mb-2">Venues</h1>
<p className="text-title-md text-on-surface-variant">Find and book the best fields.</p>
</div>
<div className="text-on-surface-variant text-sm font-medium">Showing 1-6 of 24 results</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
{/* Field Card 1 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow duration-300 group flex flex-col">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img alt="High quality artificial turf football field under bright floodlights at night" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="High quality artificial turf football field under bright floodlights at night" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcQCO7DJflC9A0Ls_zWFr87vPrfN3AzptADc03c4c_QYc8lPo4hw-w-Xf0NdQdCevtC6AK0Hh1_tjKGm3Ob1vtQaXXcEW483rQ_7g5awFa0RNSWybQlE717O1U4hGCFlaV8LHqBTN5VzIA0LnOZxmEM_a8E6uEVcS2RW66X8cd3NhSO8vWWHW-leefR2v4xLHZfVa461UsHx5CjM7vuQOMCbWJDdLQfvlPpECdo1RvUrAk-wu3eVUQ01IQqGQ4oT01nOCBZZjWYFs" />
<div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Available Now</div>
</div>
<div className="p-6 flex flex-col flex-1">
<div className="flex justify-between items-start mb-4">
<h3 className="text-headline-lg text-xl mb-1">Velocity Arena</h3>
<div className="bg-surface-container-low text-primary px-3 py-1 rounded-lg font-bold">$45/hr</div>
</div>
<p className="text-body-lg text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-sm">location_on</span>
                            Downtown District
                        </p>
<div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-variant/50">
<div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
<img alt="Professional looking man smiling, venue owner" className="w-full h-full object-cover" data-alt="Professional looking man smiling, venue owner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUJSVOrMOpcrV_hs5b4AusXzKHqBvOn_NftgLP3CufTsFJ4_lsqyHh2SVdHdeomr3cOlOTeOG6XiFqBMwSaI9JbNpFn98mPBGpSUbQ9Q62V_FocQRDeUbduYoySbYJ09iAWW9rCL6qnfUCyW9pG55q0AmV6d-LKa-LdJMhsmT_S9XnTyMWLObgxOpDyPq2jXNCtZcOpJLHXiyCu-leDfRBmEioNS9Q-D44bTShrAecGvGgZQOBfKSxXFIRRkaJyFU5066I1C-Bv24" />
</div>
<div>
<div className="text-sm font-semibold">Managed by Kinetic HQ</div>
<div className="text-xs text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">phone</span> +1 234 567 890
                                </div>
</div>
</div>
<div className="mt-auto">
<Link href="/user/fields/1" className="w-full bg-surface-container text-primary font-semibold py-3 rounded-full hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                                View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>
</article>
{/* Field Card 2 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow duration-300 group flex flex-col">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img alt="Indoor wooden basketball court with natural light streaming through high windows" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Indoor wooden basketball court with natural light streaming through high windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6zum7tBFCZ-KKNp12C9HjYpg30Ani41DaOYlO7E9j_Pfhi_ZC571AO5fOorapD7dciP4LiX9IywpmpCVmvee6D6stWuq0NLh6Vvla6uEdE7VTplx5FsX4vmmPG1C6uXAIbDEiLJAuu6RcoOOmZQCephBJIpxVqNPjVRoda5KxncLjlvyOVp5EK1mUHQobPNshvWGFxnKcwwb-nU0ItlC1qcshD7Xr_Q3yHIgAJ2oOx4B__mUFQly7Q8cJNlhx2InamQK4xx0tmD4" />
</div>
<div className="p-6 flex flex-col flex-1">
<div className="flex justify-between items-start mb-4">
<h3 className="text-headline-lg text-xl mb-1">Apex Courts</h3>
<div className="bg-surface-container-low text-primary px-3 py-1 rounded-lg font-bold">$60/hr</div>
</div>
<p className="text-body-lg text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-sm">location_on</span>
                            Westside Complex
                        </p>
<div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-variant/50">
<div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold">
                                AC
                            </div>
<div>
<div className="text-sm font-semibold">Managed by Apex Sports</div>
<div className="text-xs text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">phone</span> +1 987 654 321
                                </div>
</div>
</div>
<div className="mt-auto">
<Link href="/user/fields/1" className="w-full bg-surface-container text-primary font-semibold py-3 rounded-full hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                                View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>
</article>
{/* Field Card 3 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow duration-300 group flex flex-col">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img alt="Outdoor clay tennis court surrounded by green trees on a sunny day" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Outdoor clay tennis court surrounded by green trees on a sunny day" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFnfYiE77KlJs_s9Oiblmp6pTKj3SPjKPokOEY_cLsk2mbge-AHeV-Sj3AZDNmAUbAYh4l8UOTu_1QZoFIp6oWDkD7mczP9yZrSI5uxZWvTDsA_6lRgqZ4L7BsfsfjA7ssbl8LKhxaDrQmrV1iON0vUFDowHGjxuqjF8Qd3J4UNSMCgHbHLZMy08ba4swQwQrKIl8g5jNj_QTMyDaQVCUUN4sFtFzw7Eo8YXNdVMswwcBbc2r9GSLguMEctuSr5ls_Hp7ZwAtST2c" />
</div>
<div className="p-6 flex flex-col flex-1">
<div className="flex justify-between items-start mb-4">
<h3 className="text-headline-lg text-xl mb-1">Pinnacle Tennis</h3>
<div className="bg-surface-container-low text-primary px-3 py-1 rounded-lg font-bold">$35/hr</div>
</div>
<p className="text-body-lg text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-sm">location_on</span>
                            North Hills Club
                        </p>
<div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-variant/50">
<div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
<img alt="Professional looking woman smiling, club manager" className="w-full h-full object-cover" data-alt="Professional looking woman smiling, club manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoQ1GI7rwxTSE0Gi_WdMbAKMGY2JUUSMoQjwn86nyJmBpA0md-tXXLGWXS-qb1_nT0C6cpXv7PWT1TiCyWqGzNAzWFm4F80z8OiF5kjViZuIBL2ESbK3WpV8Wk5gfJ4RVZ3tXZnGcabQOPkDAO-8Hm21rMAtKfpAVxZiVmhv1luLsVeJmSHdgAXkE57I7_s5KBlT5BFb980N-_dKoLvKJgqtONsfdrvjczHFU966NPO_F7C9M10e7fuRmmFV2EeWMWa6lspxky2wA" />
</div>
<div>
<div className="text-sm font-semibold">Managed by Sarah Jenkins</div>
<div className="text-xs text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">phone</span> +1 555 123 456
                                </div>
</div>
</div>
<div className="mt-auto">
<Link href="/user/fields/1" className="w-full bg-surface-container text-primary font-semibold py-3 rounded-full hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                                View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>
</article>
</div>
{/* Pagination */}
<div className="mt-16 flex justify-center items-center gap-2">
<button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold shadow-md">1</button>
<button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors font-bold">2</button>
<button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors font-bold">3</button>
<span className="text-on-surface-variant mx-2">...</span>
<button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
      </main>
    </>
  );
}
