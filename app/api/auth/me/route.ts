import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            return NextResponse.json({
                user: {
                    email: decoded.email,
                    id: decoded.userId,
                    role: decoded.role
                }
            });
        } catch (err) {
            return NextResponse.json({ user: null });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
