import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isAuthenticatedCookie } from "@/lib/auth";
import { PICK_THEME_COOKIE } from "@/lib/themes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isAuthenticatedCookie(request.cookies.get(AUTH_COOKIE)?.value);
  const needsThemePick = request.cookies.get(PICK_THEME_COOKIE)?.value === "1";

  if (pathname.startsWith("/login")) {
    if (authed) {
      return NextResponse.redirect(
        new URL(needsThemePick ? "/welcome" : "/dashboard", request.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/welcome")) {
    if (!authed) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (!authed) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(
      new URL(needsThemePick ? "/welcome" : "/dashboard", request.url),
    );
  }

  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (needsThemePick) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
};
