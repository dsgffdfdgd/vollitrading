import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { wallet: true }
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { amount } = await req.json();
        const compoundAmount = parseFloat(amount);

        if (isNaN(compoundAmount) || compoundAmount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (user.wallet.profitBalance < compoundAmount) {
            return NextResponse.json({ error: "Insufficient profit balance" }, { status: 400 });
        }

        // Perform Compound: Deduct Profit, Add to Trading
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: user.wallet.id },
                data: {
                    profitBalance: { decrement: compoundAmount },
                    tradingBalance: { increment: compoundAmount }
                }
            }),
            prisma.transaction.create({
                data: {
                    walletId: user.wallet.id,
                    type: "COMPOUND",
                    amount: compoundAmount,
                    status: "COMPLETED",
                    reference: "Profit Reinvestment"
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Compound Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
