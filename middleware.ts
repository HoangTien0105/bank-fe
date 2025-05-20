// export { auth as middleware } from "@/auth";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { jwtDecode } from "jwt-decode";

// export default async function middleware(req: NextRequest) {
//   const protectedRoutes = ["/admin", "/customer"];
//   const currentPath = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(currentPath);
//
//   if (isProtectedRoute) {
//     const session = await auth();
//     const user = session?.user;
//     const decodedToken = jwtDecode(session?.user.accessToken || "");
//
//     if (!user) {
//       return NextResponse.redirect(new URL("/login", req.nextUrl));
//     }
//   }
//
//   return NextResponse.next();
// }

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define role-based protected routes
  const roleProtectedRoutes: Record<string, string[]> = {
    "/admin": ["admin"],
    "/customer": ["customer", "admin"], // allow both roles here, adjust as needed
  };

  // Check if the path is protected
  const matchedRoute = Object.keys(roleProtectedRoutes).find((route) =>
    pathname.startsWith(route),
  );

  if (matchedRoute) {
    const session = await auth();

    if (!session?.user?.accessToken) {
      // No session or token, redirect to login
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    try {
      const decodedToken = jwtDecode(session.user.accessToken);
      const userRole = decodedToken?.role; // Ensure your token has a `role` claim

      const allowedRoles = roleProtectedRoutes[matchedRoute];
      if (!allowedRoles.includes(userRole.toLowerCase())) {
        // Role not authorized
        return NextResponse.redirect(new URL("/login", req.nextUrl)); // or /login
      }
    } catch (error) {
      // Invalid token, redirect to login
      console.log(error);
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // Allow request to continue
  return NextResponse.next();
}
