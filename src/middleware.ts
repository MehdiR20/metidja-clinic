import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, isStaffRole, verifySession } from "./lib/session";

const intlMiddleware = createMiddleware(routing);
const PROTECTED = new RegExp(`^/(${routing.locales.join("|")})/(portal|admin)(?:/|$)`);

export default async function middleware(req: NextRequest) {
  const match = req.nextUrl.pathname.match(PROTECTED);

  if (match) {
    const [, locale, area] = match;
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

    if (!session) {
      const url = new URL(`/${locale}/login`, req.url);
      url.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    if (area === "admin" && !isStaffRole(session.role)) {
      return NextResponse.redirect(new URL(`/${locale}/portal`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Everything except API routes, Next internals and static files
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
