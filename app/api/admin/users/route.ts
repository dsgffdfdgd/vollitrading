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
        // Use raw query to ensure we get chartData
        const usersRaw: any[] = await prisma.$queryRaw`
            SELECT u.id, u.name, u.email, u."createdAt", 
                   w."mainBalance", w."tradingBalance", w."profitBalance", w."chartData"
            FROM "User" u
            LEFT JOIN "Wallet" w ON u.id = w."userId"
            ORDER BY u."createdAt" DESC
        `;

        const safeUsers = usersRaw.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            wallet: {
                mainBalance: user.mainBalance || 0,
                tradingBalance: user.tradingBalance || 0,
                profitBalance: user.profitBalance || 0,
                chartData: user.chartData || null
            }
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
