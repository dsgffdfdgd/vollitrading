import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";
const STATS_FILE = path.join(process.cwd(), 'data', 'platform-stats.json');

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
    try {
        const data = await fs.readFile(STATS_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        // Fallback if file doesn't exist
        return NextResponse.json({ activeTraders: 1240, pooledCapital: 2400000, totalVolume: 54000000 });
    }
}

// POST: Update platform active stats
export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { activeTraders, pooledCapital } = body;

        // Read existing to preserve other fields if any
        let existing = { activeTraders: 1240, pooledCapital: 2400000, totalVolume: 54000000 };
        try {
            const fileContent = await fs.readFile(STATS_FILE, 'utf-8');
            existing = JSON.parse(fileContent);
        } catch (e) { }

        const newData = {
            ...existing,
            activeTraders: Number(activeTraders),
            pooledCapital: Number(pooledCapital)
        };

        await fs.writeFile(STATS_FILE, JSON.stringify(newData, null, 4));

        return NextResponse.json({ success: true, message: "Stats updated", data: newData });

    } catch (error) {
        console.error("Stats Update Error:", error);
        return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
    }
}
