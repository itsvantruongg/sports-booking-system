"use client";
import Link from "next/link";

export default function UserPage() {
  return (
    <>
      <main className="w-full">
{/* Hero Section */}
<section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
<div className="bg-surface-container-low rounded-xl overflow-hidden relative min-h-[500px] flex items-center shadow-lg">
<img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" data-alt="dynamic shot of athletes playing on an indoor multi-sport court with bright lighting and vibrant energetic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDws8RpfhcSGWy62_2rA-vkRzbWp1dml6K9HxUuQv_4uR26NLFx7Eg5qVZDPDdJgsr4KGewp7sGJxXHs637Fkm1Tf0vtJBDZI_bx0MzrthdCNgAgSUxPkm4RexOGyw_diJb8K-z_7cRNRh0p7XnWYfeGEWIJ2vXlmAuExUQJxmYLug9JUVHBY8FmVXohYZmBJlkU6wacvDxmVcNxpfirC29LB3zZAjmVTaqYKsSznwwOged76z3beAggLTjJml2rF2IibMlfqfMGps" />
<div className="absolute inset-0 bg-gradient-to-r from-surface-container-low/90 to-transparent"></div>
<div className="relative z-10 p-8 lg:p-16 w-full max-w-5xl">
<div className="max-w-2xl">
<h1 className="text-5xl lg:text-7xl font-display font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
                        Đặt sân thể thao <span className="text-primary">nhanh chóng</span> và <span className="text-primary">tiện lợi</span>
</h1>
<p className="text-lg text-on-surface-variant mb-10 font-body">
                        Tìm kiếm, đặt chỗ và thanh toán trong vài giây. Bắt đầu trận đấu của bạn ngay hôm nay tại các sân thể thao hàng đầu.
                    </p>
</div>
{/* Search Bar Glassmorphism */}
<div className="bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-xl shadow-[0_20px_40px_rgba(25,27,37,0.08)]">
<form className="flex flex-col md:flex-row gap-4 items-end">
<div className="flex-1 w-full">
<label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Môn thể thao</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">sports_soccer</span>
<select className="w-full pl-12 pr-10 py-3 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-body cursor-pointer">
<option>Bóng đá</option>
<option>Padel</option>
<option>Cầu lông</option>
</select>
</div>
</div>
<div className="flex-1 w-full">
<label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Địa điểm</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">location_on</span>
<input className="w-full pl-12 pr-4 py-3 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-body" placeholder="Thành phố, Quận..." type="text" />
</div>
</div>
<div className="flex-1 w-full">
<label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Ngày</label>
<div className="relative">
<input className="w-full px-4 py-3 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-body uppercase" type="date" />
</div>
</div>
<button className="w-full md:w-auto bg-primary text-on-primary px-8 py-3 rounded-lg font-headline font-bold hover:bg-primary-container transition-colors h-[48px] flex items-center justify-center gap-2 whitespace-nowrap" type="submit">
<span className="material-symbols-outlined">search</span> Tìm kiếm
                            </button>
</form>
</div>
</div>
</div>
</section>
{/* Featured Courts */}
<section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
<div className="flex justify-between items-end mb-10">
<div>
<h2 className="text-3xl lg:text-4xl font-display font-extrabold text-on-surface tracking-tight mb-2">Sân nổi bật</h2>
<p className="text-on-surface-variant font-body">Các sân vận động được đánh giá cao nhất trong tuần này.</p>
</div>
<button className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-container transition-colors">
                    Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{/* Court Card 1 */}
<div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group">
<div className="relative h-64 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="high quality indoor soccer field with bright green artificial turf and stadium lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjXoyzNfv-3AQ3Vzay0bWyU_Hb1SPAJdvTYu-o_3rqDOvarzwCWc1VkfRdKxt5hXVgI_8VxmfN5fko8D9cg79xMp7MJMayluPlBBWpXZvR3_ItWhycLV6NoTvsLoK5nvjDm51enQUCq17Yt4afjfYbcQ6TWigyL46HNMn9jX2KWS3iCJlbsoGgdEyR7a8oE8K6SDDi0qrUiFkqoaZwJi6D9Iu-NGb3LVurixKfX6OIDAolFQmeCXZcLZhOLbZNddTg61CAfMb-XRw" />
<div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-sm text-yellow-500" data-weight="fill">star</span>
<span className="font-bold text-sm">4.9</span>
</div>
<div className="absolute bottom-4 left-4">
<span className="bg-secondary text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Có sẵn ngay</span>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="text-xl font-display font-bold text-on-surface line-clamp-1">Khu liên hợp Thể thao Trung tâm</h3>
<div className="text-right">
<span className="block text-lg font-bold text-primary">500k</span>
<span className="text-xs text-on-surface-variant">/giờ</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">location_on</span> Quận 1, TP.HCM
                        </p>
<div className="flex gap-2 mb-6">
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Bóng đá 5v5</span>
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Mái che</span>
</div>
<Link href="/user/fields/1" className="w-full bg-surface-container hover:bg-surface-variant text-primary font-bold py-3 rounded-lg transition-colors text-center border-none" style={{ display: "block", textAlign: "center" }}>Xem chi tiết</Link>
</div>
</div>
{/* Court Card 2 */}
<div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group">
<div className="relative h-64 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="modern indoor padel court with blue playing surface and glass walls under bright lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8vh9kloWyp_NbWxk6NJlXSry-c85Juz_mwFScOdk5lkqOHYpuerGf77omzgihJUDpHKERJn5n1s3IuB9n7SFlvLT4DEEvpbPNi-VXXhb-RMQmQdGcsJfLGQISwsFNbCrFRzSGHanYsO5xSpxBQii-x-2k3CkmmyoG2ERS46KMsJN0cXgS-08dyaRaX6sI61kOq1VTLhXoCauEFUuLPhQKBFdfiHF75i2Si3KwYCFAGAA9umpyO2_zqeFnBmZraP8BWcyABxlWELc" />
<div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-sm text-yellow-500" data-weight="fill">star</span>
<span className="font-bold text-sm">4.8</span>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="text-xl font-display font-bold text-on-surface line-clamp-1">Elite Padel Club</h3>
<div className="text-right">
<span className="block text-lg font-bold text-primary">350k</span>
<span className="text-xs text-on-surface-variant">/giờ</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">location_on</span> Quận 2, TP.HCM
                        </p>
<div className="flex gap-2 mb-6">
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Padel</span>
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Trong nhà</span>
</div>
<Link href="/user/fields/1" className="w-full bg-surface-container hover:bg-surface-variant text-primary font-bold py-3 rounded-lg transition-colors text-center border-none" style={{ display: "block", textAlign: "center" }}>Xem chi tiết</Link>
</div>
</div>
{/* Court Card 3 */}
<div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group hidden lg:block">
<div className="relative h-64 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="professional indoor badminton courts with green mats and high ceiling lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZogddxv_67L7KMFBZELamW12bvN-TbaREQnCiK7ePocayPR9KbEbsU0kCQzPkqmuPROS9U7b4mK9bM606Yjt1UYnpSEa9WnXtdXirsnWd1Etz9Fka1bEf60b6c52QIbWNHrtBEtGDm2nQnYnotYm31eJkpT0btFCUnFecA1_Z2wI4Zu9nF8ZIZAs8gTFnoRcoJFRDN1fBfi9nfF4BJh7neySdLopF7JfYaNwVZ-fmm1WlPbhdPx8rv8XynUvs6S8gU6OwEvNBIn0" />
<div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-sm text-yellow-500" data-weight="fill">star</span>
<span className="font-bold text-sm">4.9</span>
</div>
<div className="absolute bottom-4 left-4">
<span className="bg-secondary text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Có sẵn ngay</span>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="text-xl font-display font-bold text-on-surface line-clamp-1">Sân Cầu lông V-Smash</h3>
<div className="text-right">
<span className="block text-lg font-bold text-primary">120k</span>
<span className="text-xs text-on-surface-variant">/giờ</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">location_on</span> Quận 7, TP.HCM
                        </p>
<div className="flex gap-2 mb-6">
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Cầu lông</span>
<span className="bg-surface-container px-2 py-1 rounded text-xs font-medium text-on-surface-variant">Thảm chuẩn</span>
</div>
<Link href="/user/fields/1" className="w-full bg-surface-container hover:bg-surface-variant text-primary font-bold py-3 rounded-lg transition-colors text-center border-none" style={{ display: "block", textAlign: "center" }}>Xem chi tiết</Link>
</div>
</div>
</div>
</section>
{/* Service Intro / Benefits Bento Grid */}
<section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
<div className="mb-12 text-center max-w-2xl mx-auto">
<h2 className="text-3xl lg:text-4xl font-display font-extrabold text-on-surface tracking-tight mb-4">Tại sao chọn Velocity Court?</h2>
<p className="text-on-surface-variant text-lg">Trải nghiệm đặt sân thể thao mượt mà, chuyên nghiệp và đáng tin cậy nhất.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Bento Item 1 */}
<div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
<div className="bg-primary/10 p-4 rounded-full mb-6">
<span className="material-symbols-outlined text-primary text-3xl">bolt</span>
</div>
<h3 className="text-xl font-display font-bold text-on-surface mb-3">Đặt chỗ siêu tốc</h3>
<p className="text-on-surface-variant font-body leading-relaxed">Tìm kiếm và xác nhận lịch trống trong thời gian thực. Không cần gọi điện, không cần chờ đợi xác nhận.</p>
</div>
{/* Bento Item 2 */}
<div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
<div className="bg-primary/10 p-4 rounded-full mb-6">
<span className="material-symbols-outlined text-primary text-3xl">category</span>
</div>
<h3 className="text-xl font-display font-bold text-on-surface mb-3">Đa dạng môn thể thao</h3>
<p className="text-on-surface-variant font-body leading-relaxed">Từ bóng đá sân cỏ nhân tạo, Padel hiện đại đến sân cầu lông tiêu chuẩn. Mọi nhu cầu thể thao của bạn đều được đáp ứng.</p>
</div>
{/* Bento Item 3 */}
<div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
<div className="bg-primary/10 p-4 rounded-full mb-6">
<span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
</div>
<h3 className="text-xl font-display font-bold text-on-surface mb-3">Thanh toán dễ dàng</h3>
<p className="text-on-surface-variant font-body leading-relaxed">Hỗ trợ đa dạng phương thức thanh toán an toàn, từ ví điện tử đến chuyển khoản ngân hàng.</p>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-surface-container-low pt-16 pb-8 px-4 sm:px-8 mt-12 border-t-0">
<div className="max-w-[1440px] mx-auto">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
<div className="col-span-1 md:col-span-2">
<a className="text-2xl font-black tracking-tighter text-primary block mb-6" href="#">KINETIC</a>
<p className="text-on-surface-variant font-body max-w-sm">
                        Nền tảng đặt sân thể thao hàng đầu, kết nối người chơi với các sân bãi chất lượng cao một cách nhanh chóng và tiện lợi.
                    </p>
</div>
<div>
<h4 className="font-display font-bold text-on-surface mb-6">Khám phá</h4>
<ul className="space-y-4">
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Sân Bóng Đá</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Sân Padel</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Sân Cầu Lông</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Bản Đồ</a></li>
</ul>
</div>
<div>
<h4 className="font-display font-bold text-on-surface mb-6">Hỗ trợ</h4>
<ul className="space-y-4">
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Trung Tâm Trợ Giúp</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Dành Cho Đối Tác</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Điều Khoản Dịch Vụ</a></li>
<li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Chính Sách Bảo Mật</a></li>
</ul>
</div>
</div>
<div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-sm text-on-surface-variant">© 2024 Kinetic Platform. All rights reserved.</p>
<div className="flex gap-4">
<a className="text-on-surface-variant hover:text-primary" href="#"><span className="material-symbols-outlined">language</span></a>
</div>
</div>
</div>
</footer>
    </>
  );
}
