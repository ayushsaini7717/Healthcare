
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server"; 

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/hospital-admin") || pathname.startsWith("/api/hospital-admin")) {
      if (!token || token.role !== "HOSPITAL_ADMIN" || !token.hospitalId) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!token || token.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);


export const config = {
  matcher: [
    "/hospital-admin/:path*", 
    "/admin/:path*", 
    "/api/hospital-admin/:path*",  
    "/super-admin/:path*"
  ],
};