import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

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

        const { amount, method, address } = await req.json();
        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount < 50) {
            return NextResponse.json({ error: "Minimum withdrawal is $50" }, { status: 400 });
        }

        if (user.wallet.profitBalance < withdrawAmount) {
            return NextResponse.json({ error: "Insufficient profit balance" }, { status: 400 });
        }

        // Perform Withdraw Request: Deduct Profit immediately (to prevent double withdraw), Create Pending Transaction
        // Alternatively, hold funds in "Locked" state. For now, deduct + Pending is standard.
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: user.wallet.id },
                data: {
                    profitBalance: { decrement: withdrawAmount }
                }
            }),
            prisma.transaction.create({
                data: {
                    walletId: user.wallet.id,
                    type: "WITHDRAWAL",
                    amount: withdrawAmount,
                    status: "PENDING",
                    reference: `To: ${address} (${method})`
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Withdraw Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
