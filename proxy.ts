import { NextResponse, type NextRequest } from "next/server";
import { isLocale, type Locale } from "./app/i18n";

const localeCookie = "ekipma_locale";

function countryLocale(request: NextRequest): Locale {
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  return country?.toUpperCase() === "IR" ? "fa" : "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const preferred = request.cookies.get(localeCookie)?.value;
    const locale = isLocale(preferred) ? preferred : countryLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
  }

  const locale = pathname.slice(1);
  if (!isLocale(locale)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("locale", locale);
  const headers = new Headers(request.headers);
  headers.set("x-ekipma-locale", locale);
  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set(localeCookie, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return response;
}

export const config = { matcher: ["/", "/en", "/fa"] };
