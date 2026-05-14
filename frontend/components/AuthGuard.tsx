"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Lấy thông tin đăng nhập từ localStorage
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isHomePage = pathname === "/";
    const isUserRoute = pathname.startsWith("/user");
    const isOwnerRoute = pathname.startsWith("/owner");
    const isAdminRoute = pathname.startsWith("/admin");

    if (!token || !role) {
      // CHƯA ĐĂNG NHẬP
      if (isUserRoute || isOwnerRoute || isAdminRoute) {
        setIsReady(true);
        router.push("/login");
      } else {
        setIsReady(true);
      }
    } else {
      // ĐÃ ĐĂNG NHẬP
      const userRole = (role || "").toUpperCase();

      const redirectHome = () => {
        setIsReady(true);
        if (userRole === "ADMIN") router.push("/admin");
        else if (userRole === "OWNER") router.push("/owner");
        else router.push("/user");
      };

      if (isAuthPage) {
        redirectHome();
        return;
      }

      if (isAdminRoute && userRole !== "ADMIN") {
        redirectHome();
        return;
      }
      
      if (isOwnerRoute && userRole !== "OWNER") {
        redirectHome();
        return;
      }

      // Allow ADMIN and OWNER to access user routes, but not vice versa
      if (isUserRoute && !['USER', 'OWNER', 'ADMIN'].includes(userRole)) {
        redirectHome();
        return;
      }

      setIsReady(true);
    }
  }, [pathname, router]);

  // Render trực tiếp children để tránh lỗi Back-Forward Cache (bfcache) 
  // của trình duyệt làm lưu trạng thái màn hình ẩn (opacity-0) khi ấn Back/Next.
  return <>{children}</>;
}
