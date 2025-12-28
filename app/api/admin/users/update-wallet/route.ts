import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.email === ADMIN_EMAIL;
    } catch { return false; }
}

export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, mainBalance, tradingBalance, profitBalance } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        await prisma.wallet.update({
            where: { userId: userId },
            data: {
                mainBalance: parseFloat(mainBalance),
                tradingBalance: parseFloat(tradingBalance),
                profitBalance: parseFloat(profitBalance)
            }
        });

        return NextResponse.json({ success: true, message: "Wallet updated successfully" });
    } catch (error) {
        console.error("Wallet Update Error:", error);
        return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
    }
}
