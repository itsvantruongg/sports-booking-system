"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("user_role");
      
      const isAuthPage = pathname === "/login" || pathname === "/register";
      const isPublicRoute = pathname === "/" || pathname === "/fields" || pathname === "/partnership";
      const isForceChangePage = pathname === "/owner/change-password";
      const isUserRoute = pathname.startsWith("/user");
      const isOwnerRoute = pathname.startsWith("/owner") && !isForceChangePage;
      const isAdminRoute = pathname.startsWith("/admin");

      const mustChange = localStorage.getItem("must_change_password") === "true";

      if (!token) {
        setIsVerifying(false);
        if (isUserRoute || isOwnerRoute || isAdminRoute || isForceChangePage) {
          router.push("/login");
        } else {
          setIsReady(true);
        }
        return;
      }

      // If must change password, redirect to force-change page (unless already there)
      if (mustChange && !isForceChangePage && !isPublicRoute) {
        router.push("/owner/change-password");
        setIsVerifying(false);
        return;
      }

      // Verify token with server
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const userData = await res.json();
          const userRole = userData.role.toUpperCase();
          
          // Sync role and must_change flag
          localStorage.setItem("user_role", userRole);
          localStorage.setItem("must_change_password", userData.must_change_password ? "true" : "false");

          if (isAuthPage) {
            if (userData.must_change_password) router.push("/owner/change-password");
            else if (userRole === "ADMIN") router.push("/admin");
            else if (userRole === "OWNER") router.push("/owner");
            else router.push("/user");
            return;
          }

          // If on force-change page but already changed, redirect to dashboard
          if (isForceChangePage && !userData.must_change_password) {
             if (userRole === "ADMIN") router.push("/admin");
             else if (userRole === "OWNER") router.push("/owner");
             else router.push("/user");
             return;
          }

          // Check permissions (skip if on force-change page)
          if (!isForceChangePage) {
            if (isAdminRoute && userRole !== "ADMIN") {
              router.push("/admin"); 
              return;
            }
            if (isOwnerRoute && userRole !== "OWNER") {
              router.push("/owner");
              return;
            }
          }

          setIsReady(true);
        } else {
          // Token invalid or expired
          localStorage.clear();
          if (isUserRoute || isOwnerRoute || isAdminRoute) {
            router.push("/login");
          } else {
            setIsReady(true);
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        // On network error, we stay on current page but maybe restricted
        setIsReady(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [pathname, router]);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPublicRoute = pathname === "/" || pathname === "/fields" || pathname === "/partnership";

  if (isVerifying && !isReady && !isPublicRoute && !isAuthPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-on-surface-variant animate-pulse">Đang xác thực phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
