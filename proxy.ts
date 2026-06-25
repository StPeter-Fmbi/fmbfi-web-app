import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // Password not yet changed
  if (
    token.isPasswordChanged === false &&
    pathname.startsWith("/user") &&
    pathname !== "/user/change-password"
  ) {
    return NextResponse.redirect(
      new URL("/user/change-password", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};