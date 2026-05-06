"use client";
import Link from "next/link";

export default function AdminAddPartnerPage() {
  return (
    <div className="p-6 lg:p-12">
<div className="max-w-6xl mx-auto">
<header className="mb-12">
<h2 className="display-font text-4xl font-bold text-on-surface tracking-tight mb-2">Partner Onboarding</h2>
<p className="font-body text-lg text-on-surface-variant">Add a new partner venue to the Kinetic network.</p>
</header>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
{/* Left Column: Form */}
<div className="lg:col-span-8">
<form className="space-y-8 bg-surface-container-low rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative z-10">
{/* Venue Details Section */}
<div>
<h3 className="display-font text-2xl font-bold text-on-surface mb-6 border-b-2 border-surface-container-high pb-4 inline-block">Venue Details</h3>
<div className="space-y-6">
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="venueName">Venue Name</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="venueName" name="venueName" placeholder="e.g. Downtown Athletics Center" type="text" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="venueType">Primary Sport/Facility Type</label>
<select className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="venueType" name="venueType">
<option disabled={true}  value="">Select facility type</option>
<option value="tennis">Tennis Courts</option>
<option value="padel">Padel Courts</option>
<option value="basketball">Basketball</option>
<option value="turf">Indoor Turf</option>
</select>
</div>
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="venueCity">City</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="venueCity" name="venueCity" placeholder="City" type="text" />
</div>
</div>
</div>
</div>
{/* Owner Contact Section */}
<div className="pt-6">
<h3 className="display-font text-2xl font-bold text-on-surface mb-6 border-b-2 border-surface-container-high pb-4 inline-block">Owner Contact</h3>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="ownerFirstName">First Name</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="ownerFirstName" name="ownerFirstName" placeholder="First Name" type="text" />
</div>
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="ownerLastName">Last Name</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="ownerLastName" name="ownerLastName" placeholder="Last Name" type="text" />
</div>
</div>
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="ownerEmail">Email Address</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="ownerEmail" name="ownerEmail" placeholder="partner@example.com" type="email" />
</div>
<div>
<label className="block font-body text-sm font-semibold text-on-surface mb-2" htmlFor="ownerPhone">Phone Number</label>
<input className="w-full bg-surface-container-lowest border-2 border-transparent rounded-md px-4 py-3 font-body text-on-surface placeholder:text-outline-variant focus:border-surface-variant focus:bg-surface-bright focus:ring-0 transition-colors duration-200" id="ownerPhone" name="ownerPhone" placeholder="+1 (555) 000-0000" type="tel" />
</div>
</div>
</div>
</form>
</div>
{/* Right Column: Info & Action */}
<div className="lg:col-span-4 flex flex-col gap-6">
{/* Security Protocol Note */}
<div className="bg-surface-container-highest rounded-xl p-6 relative overflow-hidden">
<div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
<div className="flex items-start gap-4 relative z-10">
<div className="bg-surface-container-lowest p-2 rounded-full text-primary shrink-0">
<span className="material-symbols-outlined" data-icon="lock" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
</div>
<div>
<h4 className="display-font text-lg font-bold text-on-surface mb-2">Security Protocol</h4>
<p className="font-body text-sm text-on-surface-variant leading-relaxed">
                                    For security purposes, initial passwords are not set here. The system will auto-generate strong credentials and send a secure password setup link directly to the partner's email address upon creation.
                                </p>
</div>
</div>
</div>
{/* Action Card */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_24px_60px_rgba(25,27,37,0.06)] border border-outline-variant/15 flex flex-col justify-center items-center text-center mt-auto">
<div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-primary">
<span className="material-symbols-outlined text-3xl" data-icon="rocket_launch">rocket_launch</span>
</div>
<h4 className="display-font text-xl font-bold text-on-surface mb-2">Ready to Launch?</h4>
<p className="font-body text-sm text-on-surface-variant mb-8">Review details before sending the onboarding invitation.</p>
<button className="w-full bg-primary text-on-primary font-display font-bold text-lg rounded-full py-4 px-6 hover:bg-gradient-to-br hover:from-primary hover:to-primary-container shadow-[0_12px_40px_rgba(0,62,199,0.2)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0">
                            Create Partner Account
                        </button>
</div>
</div>
</div>
</div>
    </div>
  );
}
