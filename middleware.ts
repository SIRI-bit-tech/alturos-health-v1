import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/doctor",
  "/admin",
  "/appointments",
  "/medical-records",
  "/prescriptions",
  "/notifications",
  "/profile",
]

// Define public routes that don't require authentication
const publicRoutes = ["/", "/auth/login", "/auth/register", "/emergency", "/locations"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route)),
  )

  // Get token from cookies or headers
  const token =
    request.cookies.get("access_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login/register with a valid token, redirect to appropriate dashboard
  if ((pathname === "/auth/login" || pathname === "/auth/register") && token) {
    // You might want to decode the token to get user type, but for now redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Add CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
