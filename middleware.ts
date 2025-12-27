import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            const url = new URL("/login", request.url);
            return NextResponse.redirect(url);
        }
    }

    // Redirect to dashboard if logged in and trying to access auth pages
    if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && token) {
        const url = new URL("/dashboard", request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
