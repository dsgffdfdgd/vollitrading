import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";

// Force dynamic to ensure we always fetch from DB
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

// GET: Fetch platform stats
export async function GET() {
    try {
        // Fallback to raw query because Prisma Client might be stale/locked
        const statsRaw: any[] = await prisma.$queryRaw`SELECT * FROM "PlatformStat" LIMIT 1`;
        const stats = statsRaw[0];

        if (stats) {
            return NextResponse.json({
                activeTraders: stats.activeTraders || 1240,
                pooledCapital: stats.pooledCapital || 2400000,
                activeTradingDisplay: stats.activeTradingDisplay || 0
            });
        }

        // Default values if DB is empty
        return NextResponse.json({
            activeTraders: 1240,
            pooledCapital: 2400000,
            activeTradingDisplay: 0
        });

    } catch (error) {
        console.error("Stats Fetch Error:", error);
        return NextResponse.json({ activeTraders: 1240, pooledCapital: 2400000, activeTradingDisplay: 0 });
    }
}

// POST: Update platform active stats
export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { activeTraders, pooledCapital, activeTradingDisplay } = body;

        // Use raw queries to bypass stale client
        const statsRaw: any[] = await prisma.$queryRaw`SELECT * FROM "PlatformStat" LIMIT 1`;
        const existing = statsRaw[0];

        if (existing) {
            await prisma.$executeRaw`
                UPDATE "PlatformStat" 
                SET "activeTraders" = ${Number(activeTraders)}, 
                    "pooledCapital" = ${Number(pooledCapital)}, 
                    "activeTradingDisplay" = ${Number(activeTradingDisplay || 0)},
                    "updatedAt" = NOW()
                WHERE id = ${existing.id}
            `;
        } else {
            const newId = 'global-stat-' + Date.now();
            await prisma.$executeRaw`
                INSERT INTO "PlatformStat" (id, "activeTraders", "pooledCapital", "activeTradingDisplay", "updatedAt")
                VALUES (${newId}, ${Number(activeTraders)}, ${Number(pooledCapital)}, ${Number(activeTradingDisplay || 0)}, NOW())
            `;
        }

        return NextResponse.json({ success: true, message: "Stats updated" });

    } catch (error: any) {
        console.error("Stats Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update stats" }, { status: 500 });
    }
}
