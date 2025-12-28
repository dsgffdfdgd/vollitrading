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
        const transferAmount = parseFloat(amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (user.wallet.mainBalance < transferAmount) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // Perform Transfer: Deduct Main, Add to Trading
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: user.wallet.id },
                data: {
                    mainBalance: { decrement: transferAmount },
                    profitBalance: { increment: transferAmount }
                }
            }),
            prisma.transaction.create({
                data: {
                    walletId: user.wallet.id,
                    type: "TRANSFER",
                    amount: transferAmount,
                    status: "COMPLETED",
                    reference: "Main to Profit Wallet"
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Transfer Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
