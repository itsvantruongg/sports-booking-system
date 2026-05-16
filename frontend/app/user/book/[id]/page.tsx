"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserBookDynamicPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [venue, setVenue] = useState<any>(null);
  const [courts, setCourts] = useState<any[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/public/venues/${id}`)
      .then(res => res.json())
      .then(data => {
        setVenue(data);
        setCourts(data.courts || []);
        if (data.courts && data.courts.length > 0) {
          setSelectedCourt(data.courts[0]._id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (selectedCourt && date) {
      setSlotsLoading(true);
      fetch(`http://127.0.0.1:5000/api/public/courts/${selectedCourt}/time-slots?date=${date}`)
        .then(res => res.json())
        .then(data => {
          setTimeSlots(data);
          setSelectedSlotIds([]); // Reset
          setSlotsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setSlotsLoading(false);
        });
    }
  }, [selectedCourt, date]);

  const toggleSlot = (slotId: string, status: string) => {
    if (status !== 'AVAILABLE') return;
    setSelectedSlotIds(prev => 
      prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const selectedSlots = (timeSlots || []).filter(s => selectedSlotIds.includes(s._id));
  const subtotal = selectedSlots.reduce((sum, s) => sum + (s.price || 0), 0);

  const handleConfirmBooking = async () => {
    if (selectedSlotIds.length === 0) return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setBooking(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          court_id: selectedCourt,
          booking_date: date,
          time_slot_ids: selectedSlotIds
        })
      });

      if (res.ok) {
        const data = await res.json();
        const bookingId = data.booking_id || data.booking?._id || data._id;
        router.push(`/user/payment?bookingId=${bookingId}&amount=${subtotal}`);
      } else {
        const data = await res.json();
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_role");
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
          return;
        }
        alert(data.message || "Đặt sân thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium animate-pulse">Đang tải thông tin sân...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-error">Không tìm thấy thông tin sân</h2>
          <Link href="/fields" className="text-primary font-bold hover:underline">Quay lại danh sách sân</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12">
      <div className="mb-10">
        <Link href={`/fields/${id}`} className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Quay lại trang sân
        </Link>
        <h1 className="text-4xl font-black tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Đặt lịch của bạn</h1>
        <p className="text-on-surface-variant opacity-80 font-medium">{venue?.name} • {venue?.address}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Main Content */}
        <div className="w-full lg:flex-1 space-y-8">
          <section className="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/10">
            <div className="mb-8">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                1. Chọn sân con
              </h2>
              <div className="flex flex-wrap gap-3">
                {courts.map(c => (
                  <button 
                    key={c._id}
                    onClick={() => setSelectedCourt(c._id)}
                    className={`py-3 px-6 rounded-2xl font-bold text-sm transition-all border ${
                      selectedCourt === c._id 
                        ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105' 
                        : 'bg-surface-container-highest/30 border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  2. Chọn ngày
                </h2>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary shadow-sm outline-none" 
                />
              </div>

              <div>
                <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  3. Chọn khung giờ
                </h2>
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {slotsLoading ? (
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="col-span-2 py-8 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                      <p className="text-sm font-bold text-on-surface-variant opacity-50">Không có lịch trống trong ngày này</p>
                    </div>
                  ) : (
                    timeSlots.map(slot => (
                      <button 
                        key={slot._id}
                        onClick={() => toggleSlot(slot._id, slot.status)}
                        disabled={slot.status !== 'AVAILABLE'}
                        className={`group p-4 rounded-2xl text-left transition-all border ${
                          slot.status !== 'AVAILABLE' 
                            ? 'bg-surface-container-highest/20 text-on-surface-variant/30 cursor-not-allowed border-transparent' 
                            : selectedSlotIds.includes(slot._id) 
                              ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/10 scale-[0.98]' 
                              : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <p className="font-black text-sm mb-1">{slot.start_time} - {slot.end_time}</p>
                        <p className={`text-[11px] font-black ${selectedSlotIds.includes(slot._id) ? 'text-on-primary/70' : 'text-primary'}`}>
                          {slot.price.toLocaleString('vi-VN')} ₫
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96">
          <div className="bg-surface-container-low rounded-3xl p-8 shadow-xl border border-outline-variant/10 sticky top-32">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              Chi tiết đơn đặt
            </h3>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-outline-variant/20">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-surface-container shadow-inner">
                <img src={venue.images?.[0]?.url || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-on-surface leading-tight mb-1">{venue.name}</h4>
                <p className="text-xs font-bold text-on-surface-variant opacity-60 line-clamp-1">{venue.district}, {venue.city}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-bold">Ngày đặt</span>
                <span className="font-black text-on-surface">{new Date(date).toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-on-surface-variant font-bold">Sân con</span>
                <span className="font-black text-on-surface">{courts.find(c => c._id === selectedCourt)?.name || "Chưa chọn"}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/10">
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3">Khung giờ ({selectedSlots.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.length === 0 ? (
                    <p className="text-xs font-bold text-on-surface-variant opacity-40 italic">Vui lòng chọn khung giờ</p>
                  ) : (
                    selectedSlots.map(s => (
                      <span key={s._id} className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-xl border border-primary/20">
                        {s.start_time} - {s.end_time}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-container-highest/30 rounded-2xl p-6 mb-8 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-on-surface-variant opacity-60">Tạm tính</span>
                <span className="text-sm font-black text-on-surface">{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-outline-variant/20">
                <span className="font-black text-on-surface">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmBooking}
              disabled={selectedSlotIds.length === 0 || booking}
              className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl shadow-primary/20 disabled:opacity-40 disabled:hover:translate-y-0 active:scale-95"
            >
              {booking ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant opacity-40">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Thanh toán an toàn</span>
            </div>
          </div>
        </aside>
      </div>
      </main>
    );
  }
