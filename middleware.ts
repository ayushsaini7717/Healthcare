import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; 

    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/dashboard") && !token?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/test", 
    "/test/:path*",   
    "/admin/:path*",     
    "/api/protected/:path*", 
  ],
};
