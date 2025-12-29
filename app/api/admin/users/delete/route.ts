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

export async function DELETE(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // 1. Delete associated data first to handle relations manually if Cascade is not set
        // (Though CADE ON DELETE is standard, being explicit is safer)
        await prisma.transaction.deleteMany({ where: { wallet: { userId } } });
        await prisma.trade.deleteMany({ where: { userId } });
        await prisma.notification.deleteMany({ where: { userId } });

        // 2. Delete Wallet
        await prisma.wallet.delete({ where: { userId } });

        // 3. Delete User
        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
