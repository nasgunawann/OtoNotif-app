import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const publicPaths = ["/login", "/register", "/_next"]
const authPaths = ["/dashboard", "/vehicles", "/history", "/maintenance", "/profile"]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  const demoCookie = request.cookies.get("otonotif_demo")?.value
  const isAuthenticated = !!sessionCookie || demoCookie === "true"

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (authPaths.some((p) => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/vehicles/:path*",
    "/history/:path*",
    "/maintenance/:path*",
    "/profile/:path*",
    "/api/:path*",
  ],
}
