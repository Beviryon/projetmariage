import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_KEY = "wedding_authenticated";
const PROTECTED_PATHS = ["/upload", "/galerie"]; // Pages nécessitant authentification
const IS_PRIVATE = process.env.NEXT_PUBLIC_WEDDING_PRIVATE === "true";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne pas protéger la page d'auth
  if (pathname === "/auth") {
    return NextResponse.next();
  }

  // Dashboard : toujours protégé (réservé aux mariés)
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("wedding_authenticated")?.value;
    if (authCookie === "true") {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Si le site n'est pas en mode privé, laisser passer le reste
  if (!IS_PRIVATE) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("wedding_authenticated")?.value;
  const secretLink = request.nextUrl.searchParams.get("secret");

  if (authCookie === "true" || secretLink === process.env.NEXT_PUBLIC_WEDDING_SECRET) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/auth";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Ne pas exécuter le middleware sur les assets et l'API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
