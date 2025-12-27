import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        // Mock getting user from session
        const user = await prisma.user.findFirst({ where: { email: "demo@vollifx.com" }, include: { wallet: true } });

        if (!user || !user.wallet) {
            return NextResponse.json({ transactions: [] });
        }

        const transactions = await prisma.transaction.findMany({
            where: { walletId: user.wallet.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
