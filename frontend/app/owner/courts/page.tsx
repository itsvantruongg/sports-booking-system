"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerCourtsPage() {
  const router = useRouter();
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/owner/courts", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setCourts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, [router]);

  return (
    <div className="p-6 lg:p-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-2">Quản lý Sân</h1>
          <p className="text-lg text-on-surface-variant font-body">Manage your active venues, rates, and availability schedules.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg font-body focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-colors" placeholder="Tìm kiếm sân..." type="text" />
          </div>
        </div>
      </header>
      {/* Quick Stats (Bento Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-on-surface-variant font-semibold font-body">Tổng số sân con</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
            </div>
          </div>
          <div className="text-5xl font-display font-bold text-on-surface relative z-10">{courts.length}</div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-on-surface-variant font-semibold font-body">Trạng thái</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-5xl font-display font-bold text-on-surface">Good</span>
          </div>
        </div>
      </section>

      {/* Court List */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold text-on-surface">Danh sách Sân</h2>
        </div>

        {loading ? (
          <div className="text-center py-10 text-on-surface-variant">Đang tải danh sách sân...</div>
        ) : courts.length === 0 ? (
          <div className="text-center py-10 text-on-surface-variant bg-surface-container-low rounded-xl">Chưa có sân con nào được tạo.</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {courts.map((court) => (
              <div key={court._id} className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
                <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbrRjGH7s7xAhJU-gynFjpOFA0RnEhv_Dlj9X7f7JXOUnFr9gB0ppEj3SY68ctzATtTLneQRORcI7muqgM2y6HTXEpa8xtABI3DNS1RrNxoehylqdekEq_W9CNJ_cHO5M1uzX9lYCd-EIbd98ewbH-sx7EsZ_-6M6kiu9J6JnxUPDV0OY7EjE8Cw-iOa6ttu5dqlhpTQy0ssYMnJxb_2S1rVfuDFaTRnWwuihLoqpr0OW_YTOitJ3qdix6Fn5zopeYtyyZp0EJkBE" />
                </div>
                <div className="flex flex-col flex-1 justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-on-surface mb-1">{court.name}</h3>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">{court.sport_type_id?.name || "Thể thao"}</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${court.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{court.status === 'ACTIVE' ? '● Hoạt động' : '● Bảo trì'}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2">{court.description || "Sân con thuộc hệ thống."}</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-surface-variant/30 pt-4 gap-3">
                    {court.cluster_id && (
                      <Link href={`/owner/venues/${court.cluster_id}/edit`}
                        className="flex items-center gap-2 bg-primary text-on-primary font-semibold py-2 px-5 rounded-full hover:shadow-md transition-all text-sm">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Chỉnh sửa Venue
                      </Link>
                    )}
                    <Link href="/owner/pricing"
                      className="flex items-center gap-2 bg-surface-container text-primary font-semibold py-2 px-4 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                      <span className="material-symbols-outlined text-[16px]">price_change</span>
                      Quản lý giá
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
      {/* Add padding to bottom for scrolling clearance */}
      <div className="h-24"></div>
    </div>
  );
}