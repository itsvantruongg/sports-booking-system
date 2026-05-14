"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low pt-16 pb-8 px-4 sm:px-8 mt-12 border-t border-outline-variant/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link className="text-2xl font-black tracking-tighter text-primary block mb-6" href="/" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              KINETIC
            </Link>
            <p className="text-on-surface-variant font-body max-w-sm leading-relaxed opacity-80">
              Nền tảng đặt sân thể thao hàng đầu, kết nối người chơi với các sân bãi chất lượng cao một cách nhanh chóng và tiện lợi.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">Khám phá</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="/fields?sport=bong-da">Sân Bóng Đá</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="/fields?sport=tennis">Sân Tennis</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="/fields?sport=cau-long">Sân Cầu Lông</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="/fields?sport=da-nang">Sân Pickleball</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="#">Trung Tâm Trợ Giúp</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="#">Dành Cho Đối Tác</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="#">Điều Khoản Dịch Vụ</Link></li>
              <li><Link className="text-on-surface-variant hover:text-primary transition-colors" href="#">Chính Sách Bảo Mật</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant opacity-60">© 2024 Kinetic Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="text-on-surface-variant hover:text-primary opacity-60 hover:opacity-100 transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">language</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
