import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-key-change-this"
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Protect Admin Routes (Pages and API)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!token) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            // Strict Email Check for Admin Access
            if (payload.email !== "allankipkoech65@gmail.com") {
                if (pathname.startsWith("/api")) {
                    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
                }
                // Redirect unauthorized users to dashboard
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (err) {
            // Token invalid or verification failed
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

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
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        "/admin/:path*",
        "/api/admin/:path*"
    ],
};
