import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.email === ADMIN_EMAIL;
    } catch { return false; }
}

export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                wallet: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Safe map to avoid sending password hashes if they exist (though prisma default might not select them depending on logic)
        // Adjust returned fields as needed
        const safeUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            wallet: {
                mainBalance: user.wallet?.mainBalance || 0,
                tradingBalance: user.wallet?.tradingBalance || 0,
                profitBalance: user.wallet?.profitBalance || 0
            }
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
