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
        const { userId, mainBalance, tradingBalance, profitBalance, chartData, performanceMetrics } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // 1. Fetch current wallet to calculate deltas
        const currentWallet = await prisma.wallet.findUnique({
            where: { userId: userId }
        });

        if (!currentWallet) {
            return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
        }

        const newMain = parseFloat(mainBalance);
        const newTrading = parseFloat(tradingBalance);
        const newProfit = parseFloat(profitBalance);

        const deltaMain = newMain - currentWallet.mainBalance;
        const deltaTrading = newTrading - currentWallet.tradingBalance;
        const deltaProfit = newProfit - currentWallet.profitBalance;

        const transactions: any[] = [];

        // Helper to add transaction
        const addTx = (amount: number, type: string, ref: string) => {
            if (Math.abs(amount) < 0.0001) return;
            transactions.push(
                prisma.transaction.create({
                    data: {
                        walletId: currentWallet.id,
                        type: type, // DEPOSIT, WITHDRAWAL, or ADJUSTMENT
                        amount: Math.abs(amount),
                        status: "COMPLETED",
                        reference: ref
                    }
                })
            );
        };

        // 2. Determine types and create records
        if (deltaMain !== 0) {
            const type = deltaMain > 0 ? "DEPOSIT" : "WITHDRAWAL";
            addTx(deltaMain, type, `Balance Adjustment`);
        }
        if (deltaTrading !== 0) {
            // Trading changes treated as Deposit/Withdrawal to/from pool
            const type = deltaTrading > 0 ? "DEPOSIT" : "WITHDRAWAL";
            addTx(deltaTrading, type, `Pool Allocation`);
        }
        if (deltaProfit !== 0) {
            const type = deltaProfit > 0 ? "PROFIT" : "LOSS";
            addTx(deltaProfit, type, `P&L Adjustment`);
        }

        // 3. Execute Transaction
        await prisma.$transaction([
            prisma.wallet.update({
                where: { userId: userId },
                data: {
                    mainBalance: newMain,
                    tradingBalance: newTrading,
                    profitBalance: newProfit
                }
            }),
            ...transactions
        ]);

        // 4. Update Chart Data and Performance Metrics if provided (using raw query)
        const updates: any[] = [];
        if (chartData && Array.isArray(chartData)) {
            updates.push(prisma.$executeRaw`
                UPDATE "Wallet" 
                SET "chartData" = ${JSON.stringify(chartData)}::jsonb 
                WHERE "userId" = ${userId}
            `);
        }

        if (performanceMetrics) {
            updates.push(prisma.$executeRaw`
                UPDATE "Wallet" 
                SET "performanceMetrics" = ${JSON.stringify(performanceMetrics)}::jsonb 
                WHERE "userId" = ${userId}
            `);
        }

        await Promise.all(updates);

        return NextResponse.json({ success: true, message: "Wallet updated and transactions recorded" });
    } catch (error) {
        console.error("Wallet Update Error:", error);
        return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
    }
}
