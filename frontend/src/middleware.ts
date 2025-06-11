import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define route matchers
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/orders(.*)",
  "/cart/checkout(.*)",
  "/api/protected(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  // Ensure sessionClaims exists and has publicMetadata
  const userRole = sessionClaims?.metadata?.role || "user";

  const isTryingToAccessProtected = isProtectedRoute(req);
  const isTryingToAccessAdmin = isAdminRoute(req);

  // If trying to access a protected route but not logged in → Redirect to login
  if (isTryingToAccessProtected && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If trying to access admin routes but not an admin → Redirect to unauthorized
  if (isTryingToAccessAdmin && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

// Define protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};