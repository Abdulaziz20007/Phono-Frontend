import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // If the pathname is /settings, redirect to /profile
  if (pathname === "/settings") {
    // Store the active tab in a cookie
    const response = NextResponse.redirect(new URL("/profile", url));
    // Set a cookie to indicate which tab to activate
    response.cookies.set("profileActiveTab", "settings");
    return response;
  }

  // For /product/[id] routes that should only be handled by the App Router
  if (
    pathname.startsWith("/product/") &&
    !pathname.startsWith("/product/create")
  ) {
    // Let the App Router handle these routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/settings", "/product/:path*"],
};
