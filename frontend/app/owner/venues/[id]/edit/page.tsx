"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const COMMON_AMENITIES = [
  "Wifi", "Bãi đỗ xe", "Nhà vệ sinh", "Phòng thay đồ", "Nước uống",
  "Ánh sáng ban đêm", "Camera an ninh", "Căng tin", "Ghế nghỉ", "Tủ khóa",
];

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    district: "",
    open_time: "06:00",
    close_time: "22:00",
    amenities: [] as string[],
    images: [] as { url: string; caption?: string }[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    fetch(`http://localhost:5000/api/owner/venues`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((venues: any[]) => {
        const venue = venues.find((v: any) => v._id === id);
        if (venue) {
          setForm({
            name: venue.name ?? "",
            description: venue.description ?? "",
            address: venue.address ?? "",
            city: venue.city ?? "",
            district: venue.district ?? "",
            open_time: venue.open_time ?? "06:00",
            close_time: venue.close_time ?? "22:00",
            amenities: venue.amenities ?? [],
            images: venue.images ?? [],
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  const toggleAmenity = (a: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, { url: newImageUrl.trim() }] }));
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/owner/venues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          description: form.description,
          amenities: form.amenities,
          images: form.images,
          open_time: form.open_time,
          close_time: form.close_time,
        }),
      });
      if (res.ok) {
        showToast("✅ Cập nhật thông tin sân thành công!", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Cập nhật thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <Link href="/owner/courts" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Quay lại
        </Link>
        <h1 className="text-4xl font-display font-black tracking-tight text-on-surface">Chỉnh sửa Venue</h1>
        <p className="text-on-surface-variant font-body mt-1">{form.name}</p>
      </header>

      <div className="flex flex-col gap-8">
        {/* Basic Info (read-only) */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <h2 className="text-lg font-display font-black text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span> Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tên cụm sân</label>
              <p className="bg-surface-container p-3 rounded-xl text-on-surface font-medium">{form.name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Địa chỉ</label>
              <p className="bg-surface-container p-3 rounded-xl text-on-surface font-medium">{form.address || `${form.district}, ${form.city}`}</p>
            </div>
          </div>
        </div>

        {/* Giờ mở cửa */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <h2 className="text-lg font-display font-black text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">schedule</span> Giờ hoạt động
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Mở cửa</label>
              <input
                type="time"
                value={form.open_time}
                onChange={e => setForm(p => ({ ...p, open_time: e.target.value }))}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Đóng cửa</label>
              <input
                type="time"
                value={form.close_time}
                onChange={e => setForm(p => ({ ...p, close_time: e.target.value }))}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <h2 className="text-lg font-display font-black text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span> Mô tả
          </h2>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={5}
            placeholder="Mô tả về cụm sân, điểm nổi bật, ưu điểm..."
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary transition font-body"
          />
          <p className="text-xs text-on-surface-variant mt-2">{form.description.length} ký tự</p>
        </div>

        {/* Amenities */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <h2 className="text-lg font-display font-black text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">check_circle</span> Tiện ích
          </h2>
          <div className="flex flex-wrap gap-3">
            {COMMON_AMENITIES.map(a => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  form.amenities.includes(a)
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                {form.amenities.includes(a) && "✓ "}{a}
              </button>
            ))}
          </div>
          {form.amenities.length > 0 && (
            <p className="text-xs text-on-surface-variant mt-4">Đã chọn: {form.amenities.join(", ")}</p>
          )}
        </div>

        {/* Images */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <h2 className="text-lg font-display font-black text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">photo_library</span> Hình ảnh ({form.images.length})
          </h2>

          {/* Image grid */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden h-36 bg-surface-container">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary/90 text-on-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                      Ảnh chính
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add image URL */}
          <div className="flex gap-3">
            <input
              type="url"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addImage()}
              placeholder="Nhập URL ảnh (https://...)"
              className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition font-body text-sm"
            />
            <button
              onClick={addImage}
              disabled={!newImageUrl.trim()}
              className="px-5 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:shadow-md transition-all disabled:opacity-40"
            >
              Thêm
            </button>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">Ảnh đầu tiên sẽ là ảnh đại diện hiển thị trên trang tìm kiếm.</p>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 pb-8">
          <Link href="/owner/courts" className="flex-1 py-4 rounded-2xl border-2 border-outline-variant text-on-surface font-black text-center hover:bg-surface-container-low transition-colors">
            Hủy bỏ
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-2xl bg-primary text-on-primary font-black hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving
              ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
              : <><span className="material-symbols-outlined text-[20px]">save</span> Lưu thay đổi</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
