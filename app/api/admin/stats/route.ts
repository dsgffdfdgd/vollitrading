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
        // Find the first record, if not exists, return defaults
        const stats = await prisma.platformStat.findFirst();

        if (stats) {
            return NextResponse.json({
                activeTraders: stats.activeTraders,
                pooledCapital: stats.pooledCapital
            });
        }

        // Default values if DB is empty
        return NextResponse.json({
            activeTraders: 1240,
            pooledCapital: 2400000
        });

    } catch (error) {
        console.error("Stats Fetch Error:", error);
        return NextResponse.json({ activeTraders: 1240, pooledCapital: 2400000 });
    }
}

// POST: Update platform active stats
export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { activeTraders, pooledCapital } = body;

        // Upsert: Create if no record exists, otherwise update the first one found.
        // Since we don't have a known ID, we can do:
        // 1. FindFirst
        // 2. If exists -> update
        // 3. If not -> create
        // Or simpler: just ensure one record exists.

        const existing = await prisma.platformStat.findFirst();

        let result;
        if (existing) {
            result = await prisma.platformStat.update({
                where: { id: existing.id },
                data: {
                    activeTraders: Number(activeTraders),
                    pooledCapital: Number(pooledCapital)
                }
            });
        } else {
            result = await prisma.platformStat.create({
                data: {
                    activeTraders: Number(activeTraders),
                    pooledCapital: Number(pooledCapital)
                }
            });
        }

        return NextResponse.json({ success: true, message: "Stats updated", data: result });

    } catch (error: any) {
        console.error("Stats Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update stats" }, { status: 500 });
    }
}
