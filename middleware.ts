import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accessToken = req.cookies.get("accessToken")?.value || null

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next()
  }

  // Protect appointment route
  if (pathname.startsWith("/appointment")) {
    if (!accessToken) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Matcher → specify which routes to protect
export const config = {
  matcher: ["/appointment/:path*", "/((?!_next|api|favicon.ico|images).*)"],
}
