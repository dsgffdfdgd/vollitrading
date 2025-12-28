import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";

// POST: Distribute Profit/Loss to all users
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
    return NextResponse.json({ status: "OK" });
}

export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { percentage } = await req.json();

        if (percentage === undefined || percentage === null) {
            return NextResponse.json({ error: "Percentage is required" }, { status: 400 });
        }

        const percentVal = parseFloat(percentage);

        if (isNaN(percentVal)) {
            return NextResponse.json({ error: "Invalid percentage" }, { status: 400 });
        }

        // 1. Get all wallets with a positive balance (Main or Trading)
        // Note: Prisma where OR syntax
        const activeWallets = await prisma.wallet.findMany({
            where: {
                OR: [
                    { mainBalance: { gt: 0 } },
                    { tradingBalance: { gt: 0 } }
                ]
            }
        });

        if (activeWallets.length === 0) {
            return NextResponse.json({ message: "No active wallets to distribute to." });
        }

        let totalDistributed = 0;
        const transactionOps: any[] = [];
        const walletOps: any[] = [];

        for (const wallet of activeWallets) {
            // Calculate profit based on TOTAL capital (Main + Trading)
            // This covers the user's request "amount deposited to main wallet" even if they moved it.
            const totalCapital = (wallet.mainBalance || 0) + (wallet.tradingBalance || 0);
            const amount = totalCapital * (percentVal / 100);

            // Only process if amount is significant (e.g. > 0.01 cent)
            if (Math.abs(amount) < 0.01) continue;

            const type = amount >= 0 ? "PROFIT" : "LOSS";
            const txnAmount = Math.abs(amount);

            totalDistributed += amount;

            // Op 1: Create Transaction Record
            transactionOps.push(
                prisma.transaction.create({
                    data: {
                        walletId: wallet.id,
                        type: type,
                        amount: txnAmount,
                        status: "COMPLETED",
                        reference: `Daily PnL: ${percentVal}% (on $${totalCapital.toFixed(2)})`
                    }
                })
            );

            // Op 2: Update Wallet Balance
            walletOps.push(
                prisma.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        profitBalance: {
                            increment: amount
                        }
                    }
                })
            );
        }

        await prisma.$transaction([...transactionOps, ...walletOps]);

        return NextResponse.json({
            success: true,
            message: `Distributed ${percentVal}% to ${activeWallets.length} wallets. Total value: $${totalDistributed.toFixed(2)}`
        });

    } catch (error) {
        console.error("Profit Distribution Error:", error);
        return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
    }
}
