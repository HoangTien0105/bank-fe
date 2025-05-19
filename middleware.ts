import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();
    const pathname = request.nextUrl.pathname;

    //Các route không cần xác thực
    if (pathname.startsWith("/_next") || pathname.includes("/api/")) {
      return NextResponse.next();
    }

    // Nếu đang ở trang login và đã đăng nhập, điều hướng theo role
    if (pathname === "/login" && session?.user) {
      if (session.user.role === "CUSTOMER") {
        return NextResponse.redirect(
          new URL("/customer/dashboard", request.url)
        );
      } else if (session.user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    //Nếu chưa đăng nhập và k phải trang login, redirect về login
    if (!session?.user && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    //Kiểm tra quyền truy cập vào các trang admin
    if (pathname.startsWith("/dashboard") && session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Kiểm tra quyền truy cập vào các trang customer
    if (
      pathname.startsWith("/customer") &&
      session?.user?.role !== "CUSTOMER"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
