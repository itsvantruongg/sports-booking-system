"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FieldDetailPage() {
    const params = useParams();
    const id = params.id; // Just for completeness, though we'll hardcode the UI for now.

    return (
        <>
            {/* Hero Gallery */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[614px] min-h-[500px]">
                    <div className="md:col-span-3 row-span-2 rounded-xl overflow-hidden relative group">
                        <img alt="Main court view" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="high quality sports photography of a vibrant green artificial turf football field under bright stadium lights, cinematic dynamic angle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgub8ZO9eUqAqVd5T4_HMd3kDQsf7uE8bBIDbMygESq9ILpm5LXjSXzKfWncldpT3d10KOa77K_fDf5OTObUc8ZHVIVDY3TtztS5oRAwv36a1QZ7EP5Lm17F36ZXf3b1X8JWU97s6B2UrOSfQnLvd4jFWJDMXjyogRThfJ-vNrngpYKxE_YTg5X1k_5OBrmY3IURz_AXh1Uva_qP1eImueg13iZlQ4lq6KVTGEMM9nlI2nCSn6wmQlcjaTmn0Nm8UG9I3Kpk6M6cc" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div>
                                <span className="bg-secondary text-on-secondary-container px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">Available Now</span>
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-2">Downtown Kinetic Turf A</h1>
                                <p className="text-white/80 font-body text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_on</span> 124 Main St, Urban District
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden relative hidden md:block">
                        <img alt="Amenities view" className="w-full h-full object-cover" data-alt="close up of premium locker room facilities with modern wooden benches and soft ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo33ShEp5ViF8bTEDNrM981aKMfKzMyb0TNlbI9BYCnFskcBoZRabw9s2hP1C4VXc0sVsGcEvWyYe0k30Ty0SlFV5pKLYd1u9Z8mcmmtHYmiJuHTPubk4aWQM-wTRdDcMhmwQXxUyXE0H5WTw-oYshjycxdQiDdFOV7JItigOVgzBeMFCaqJbpyfLGGqeTLJ3GNNUdpzMEU6467BJEchcCxswFNaCEcx1FlrafhsQLo1Pk8jsp6NnULt5P4G7Pw-QcDX5eI6naHnI" />
                    </div>
                    <div className="rounded-xl overflow-hidden relative hidden md:block group cursor-pointer">
                        <img alt="More photos" className="w-full h-full object-cover" data-alt="detail shot of a soccer ball resting on fresh green turf, shallow depth of field, golden hour lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4dvzDiyzCycfHaYxmvBlFyiWcNyC03kShFvFURMo0PqSBWDn5CH87xvMh8YxwL9UNAZY8qdAs7cT8sHTK97kIDIFcTiM8HdlvJ-RIHpC_jEU0f7km4br2lZShfOzUNvsomQrrzcqGcy7TPbzgSwWZzxGjK1zPJbHvQKJ-llSqqk0vpahyaQDb3BqiSGENgxcMBqVERR2uHjF-_Wzy0m72Htm8Zu5XE4cjNJ53CIIpjYpFw8iKwyMJfdZjCLQG6XKB0cLq97vidNs" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                            <span className="text-white font-headline font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined">photo_library</span> View All 12
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content & Sidebar Layout */}
            <main className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <section className="bg-surface-container-low p-8 rounded-xl">
                        <h2 className="text-2xl font-display font-bold mb-4 tracking-tight">About this Field</h2>
                        <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-6">
                            Experience top-tier gameplay on our newly renovated FIFA-certified artificial turf. Designed for optimal shock absorption and consistent ball roll, Downtown Kinetic Turf A is perfect for 5v5 or 7v7 matches. The facility features state-of-the-art LED floodlights for night games and comprehensive drainage to ensure year-round playability.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full text-on-surface-variant font-medium">
                                <span className="material-symbols-outlined text-primary">groups</span> 5v5 - 7v7
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full text-on-surface-variant font-medium">
                                <span className="material-symbols-outlined text-primary">grass</span> Artificial Turf
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full text-on-surface-variant font-medium">
                                <span className="material-symbols-outlined text-primary">wb_twilight</span> Floodlights
                            </div>
                        </div>
                    </section>

                    {/* Amenities */}
                    <section>
                        <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">local_parking</span>
                                <span className="font-body font-medium">Free Parking</span>
                            </div>
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">water_drop</span>
                                <span className="font-body font-medium">Water Station</span>
                            </div>
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">chair</span>
                                <span className="font-body font-medium">Covered Bench</span>
                            </div>
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">wc</span>
                                <span className="font-body font-medium">Restrooms</span>
                            </div>
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">checkroom</span>
                                <span className="font-body font-medium">Locker Rooms</span>
                            </div>
                            <div className="bg-surface-container-lowest p-6 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-outline-variant/15 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-shadow">
                                <span className="material-symbols-outlined text-3xl text-primary">wifi</span>
                                <span className="font-body font-medium">Free WiFi</span>
                            </div>
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Location</h2>
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/15 h-[300px] relative">
                            <img alt="Map location" className="w-full h-full object-cover grayscale opacity-80" data-alt="stylized modern map interface showing an urban grid with a distinct blue pin marker" data-location="New York" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS8Qr2EgjCwQ4HIg3GUHahBX-jRqS9dBVT9W2fhHasTJNxCvwM6JlEJ-cPzP3JtnUFpa5xJafVA8uJnXYIB5oQCrMEhFhbv1T_iK_vuDGll8UL0793i34aPBiJ4RNe-6iNl7kMR9uUdHgBTx9J_7ggfZjbtTXJMKQxk3wF-TZotrHGdgVnzWixYP9QnnrroxNKYVIKsQ9JFGYNefJdgtfqLS_YgdEXfSb4Lid7RyfPkjyDCey7TZLA10pwhCSXwMwxJnphQsABb4o" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-primary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] border border-outline-variant/15 sticky top-32">
                        <div className="mb-8">
                            <h3 className="text-3xl font-display font-bold text-primary tracking-tight mb-1">$45 <span className="text-lg text-on-surface-variant font-body font-normal">/ 60 min</span></h3>
                            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-bold text-on-surface">4.9</span> (128 reviews)
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-on-surface mb-3 font-body">Select Date</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <button className="flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors border border-transparent">
                                    <span className="text-xs text-on-surface-variant mb-1">Mon</span>
                                    <span className="text-lg font-bold">12</span>
                                </button>
                                <button className="flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center bg-primary text-on-primary shadow-md">
                                    <span className="text-xs opacity-80 mb-1">Tue</span>
                                    <span className="text-lg font-bold">13</span>
                                </button>
                                <button className="flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors border border-transparent">
                                    <span className="text-xs text-on-surface-variant mb-1">Wed</span>
                                    <span className="text-lg font-bold">14</span>
                                </button>
                                <button className="flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors border border-transparent">
                                    <span className="text-xs text-on-surface-variant mb-1">Thu</span>
                                    <span className="text-lg font-bold">15</span>
                                </button>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <label className="block text-sm font-semibold text-on-surface font-body">Available Times</label>
                                <span className="text-xs text-on-surface-variant">Duration: 60m</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="py-2 px-1 rounded-md text-sm font-medium border border-outline-variant/30 text-outline-variant bg-surface-dim cursor-not-allowed" disabled>
                                    16:00
                                </button>
                                <button className="py-2 px-1 rounded-md text-sm font-medium border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors bg-surface-container-lowest">
                                    17:00
                                </button>
                                <button className="py-2 px-1 rounded-md text-sm font-medium border-2 border-primary text-primary bg-primary/5 font-bold shadow-sm">
                                    18:00
                                </button>
                                <button className="py-2 px-1 rounded-md text-sm font-medium border border-outline-variant/30 text-outline-variant bg-surface-dim cursor-not-allowed" disabled>
                                    19:00
                                </button>
                                <button className="py-2 px-1 rounded-md text-sm font-medium border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors bg-surface-container-lowest">
                                    20:00
                                </button>
                                <button className="py-2 px-1 rounded-md text-sm font-medium border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors bg-surface-container-lowest">
                                    21:00
                                </button>
                            </div>
                        </div>

                        {/* Price Calc */}
                        <div className="bg-surface-container p-4 rounded-lg mb-8">
                            <div className="flex justify-between text-sm mb-2 text-on-surface-variant">
                                <span>$45 x 1 hour</span>
                                <span>$45.00</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 text-on-surface-variant">
                                <span>Service Fee</span>
                                <span>$4.50</span>
                            </div>
                            <div className="h-px bg-outline-variant/30 w-full mb-4"></div>
                            <div className="flex justify-between font-bold text-lg text-on-surface">
                                <span>Total</span>
                                <span>$49.50</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/user/book" className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-display font-bold text-lg hover:shadow-lg transition-all active:scale-[0.98]">
                            Book Now
                        </Link>
                        <p className="text-center text-xs text-on-surface-variant mt-4 font-body">You won't be charged yet</p>
                    </div>
                </div>
            </main>
        </>
    );
}
