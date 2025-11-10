// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow public paths (no auth check)
    const isPublicPath =
      pathname === "/" ||
      pathname.startsWith("/novels") ||
      pathname.startsWith("/auth");

    if (isPublicPath) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only require authentication for non-public routes
      authorized: ({ token }) => !!token,
    },
  }
);

// ✅ Only apply middleware to relevant paths
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth|novels|$).*)",
  ],
};

