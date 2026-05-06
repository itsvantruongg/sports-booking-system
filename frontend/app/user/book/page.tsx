"use client";
import Link from "next/link";

export default function UserBookPage() {
  return (
    <>
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
<div className="mb-10">
<h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Complete Your Booking</h1>
<p className="font-body text-on-surface-variant text-lg">Secure your court time in just a few steps.</p>
</div>
<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
{/* Left Column: Form Steps */}
<div className="w-full lg:w-2/3 flex flex-col gap-8">
{/* Step 1: Schedule */}
<section className="bg-surface-container-low rounded-xl p-8 lg:p-10 relative overflow-hidden">
<div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-xl"></div>
<div className="flex items-center gap-4 mb-6">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-display font-bold text-lg">1</div>
<h2 className="font-display text-2xl font-bold text-on-surface">Schedule Selection</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Date Picker Mock */}
<div>
<label className="block font-label text-on-surface-variant text-sm font-medium mb-2">Select Date</label>
<div className="relative">
<input className="w-full bg-surface-container-lowest border-outline-variant/15 text-on-surface font-body rounded-lg py-3 pl-4 pr-10 focus:ring-primary focus:border-primary" readOnly={true} type="text" value="Oct 24, 2023" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
</div>
</div>
{/* Time Slots Mock */}
<div>
<label className="block font-label text-on-surface-variant text-sm font-medium mb-2">Select Time</label>
<div className="grid grid-cols-2 gap-3">
<button className="py-2.5 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-body text-sm hover:bg-surface-container-highest transition-colors">18:00 - 19:00</button>
<button className="py-2.5 px-4 rounded-lg bg-secondary-container text-on-secondary-container font-body text-sm font-medium border border-transparent">19:00 - 20:30</button>
<button className="py-2.5 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-body text-sm hover:bg-surface-container-highest transition-colors">20:30 - 22:00</button>
</div>
</div>
</div>
</section>
{/* Step 2: Contact Info */}
<section className="bg-surface-container-low rounded-xl p-8 lg:p-10">
<div className="flex items-center gap-4 mb-6">
<div className="w-10 h-10 rounded-full border-2 border-outline-variant text-outline flex items-center justify-center font-display font-bold text-lg">2</div>
<h2 className="font-display text-2xl font-bold text-on-surface">Contact Information</h2>
</div>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label text-on-surface-variant text-sm font-medium mb-2">Full Name</label>
<input className="w-full bg-surface-container-lowest border-outline-variant/15 text-on-surface font-body rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all" placeholder="Jane Doe" type="text" />
</div>
<div>
<label className="block font-label text-on-surface-variant text-sm font-medium mb-2">Phone Number</label>
<input className="w-full bg-surface-container-lowest border-outline-variant/15 text-on-surface font-body rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all" placeholder="+1 (555) 000-0000" type="tel" />
</div>
</div>
<div>
<label className="block font-label text-on-surface-variant text-sm font-medium mb-2">Email Address</label>
<input className="w-full bg-surface-container-lowest border-outline-variant/15 text-on-surface font-body rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all" placeholder="jane@example.com" type="email" />
</div>
</form>
</section>
</div>
{/* Right Column: Order Summary (Sidebar) */}
<aside className="w-full lg:w-1/3">
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] sticky top-28">
<h3 className="font-display text-xl font-bold text-on-surface mb-6">Order Summary</h3>
{/* Venue Info */}
<div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-variant">
<div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
<img alt="Premium indoor basketball court with polished wood floor and bright lights" className="w-full h-full object-cover" data-alt="Premium indoor basketball court with polished wood floor and bright stadium lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnyRlfWNE16IRkeEtTLfC_UYmk3Ke_46A-g6wIlPW6dcE4c07kU0K3LXlg9-tl6c2PCs41ywjf7CRKb_VwT64_Mf3vN4dCn2e7YVI7EwT4eJt9TgzwHiNy0nfy5us3SoMZrTzpBdQxGi7_UgMr0zU_80b1YPfuEnEPcisPCHktO1mNuiOGazxqsJ1QghXvOXUtI8b8-adb_B1V3w_YCtISf3-KUw6V9TqCY_SO1O8oEBf7PtbFpvVTcjJK281EQGFopzXKgKTzYJI" />
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Downtown Arena - Court A</h4>
<p className="font-body text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[16px]">location_on</span>
                                123 Main St.
                            </p>
</div>
</div>
{/* Time Info */}
<div className="mb-6 pb-6 border-b border-surface-variant space-y-3">
<div className="flex justify-between items-center text-sm font-body">
<span className="text-on-surface-variant">Date</span>
<span className="font-medium text-on-surface">Oct 24, 2023</span>
</div>
<div className="flex justify-between items-center text-sm font-body">
<span className="text-on-surface-variant">Time</span>
<span className="font-medium text-on-surface">19:00 - 20:30 (1.5 hrs)</span>
</div>
</div>
{/* Financials */}
<div className="space-y-3 mb-8">
<div className="flex justify-between items-center text-sm font-body">
<span className="text-on-surface-variant">Subtotal</span>
<span className="font-medium text-on-surface">$120.00</span>
</div>
<div className="flex justify-between items-center text-sm font-body">
<span className="text-on-surface-variant">Service Fee (5%)</span>
<span className="font-medium text-on-surface">$6.00</span>
</div>
<div className="flex justify-between items-center pt-3 border-t border-surface-variant mt-3">
<span className="font-headline font-bold text-on-surface text-lg">Total</span>
<span className="font-display font-extrabold text-primary text-2xl">$126.00</span>
</div>
</div>
{/* Instant Confirm Notice */}
<div className="flex items-start gap-3 bg-secondary-container/30 p-4 rounded-lg mb-8">
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
<div>
<p className="font-body text-sm font-semibold text-on-surface">Instant Confirmation</p>
<p className="font-body text-xs text-on-surface-variant mt-1">Your booking will be confirmed immediately upon completion.</p>
</div>
</div>
{/* CTA */}
<button className="w-full bg-primary text-on-primary py-4 rounded-full font-headline font-bold text-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary-container transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                        Confirm Booking
                    </button>
</div>
</aside>
</div>
      </main>
    </>
  );
}
