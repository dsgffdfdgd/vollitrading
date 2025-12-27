import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Distribute Profit/Loss to all users
export async function POST(req: Request) {
    try {
        const { percentage } = await req.json();

        if (percentage === undefined || percentage === null) {
            return NextResponse.json({ error: "Percentage is required" }, { status: 400 });
        }

        const percentVal = parseFloat(percentage);

        if (isNaN(percentVal)) {
            return NextResponse.json({ error: "Invalid percentage" }, { status: 400 });
        }

        // 1. Get all wallets with a positive balance
        const activeWallets = await prisma.wallet.findMany({
            where: {
                mainBalance: {
                    gt: 0
                }
            }
        });

        if (activeWallets.length === 0) {
            return NextResponse.json({ message: "No active wallets to distribute to." });
        }

        let totalDistributed = 0;
        const transactionOps: any[] = [];
        const walletOps: any[] = [];

        // 2. Prepare bulk updates
        // Note: Prisma doesn't support bulk update with different values easily in one query without raw SQL or loop.
        // For safety and creating related transaction records, we will use a loop + $transaction.
        // Depending on user count, this might need batching, but for this scale it's fine.

        for (const wallet of activeWallets) {
            const amount = wallet.mainBalance * (percentVal / 100);

            // Only process if amount is significant (e.g. > 0.01 cent)
            if (Math.abs(amount) < 0.01) continue;

            const type = amount >= 0 ? "PROFIT" : "LOSS";
            // For LOSS, the amount in transaction is usually positive but type indicates loss, 
            // OR we store negative amount.
            // Let's store absolute amount and use Type to distinguish, OR stick to signed amount.
            // Schema has 'Float', standard is often signed for balance changes, but Transaction usually implies magnitude.
            // Looking at user dashboard: `amount: $${t.amount.toFixed(2)}`. 
            // If we store negative, it shows $-5.00. 
            // Let's store POSITIVE amount and type LOSS, but update wallet with negative.

            const txnAmount = Math.abs(amount);

            totalDistributed += amount;

            // Op 1: Create Transaction Record
            transactionOps.push(
                prisma.transaction.create({
                    data: {
                        walletId: wallet.id,
                        // Schema says // PROFIT. Maybe add LOSS? Or just use PROFIT with negative?
                        // If I simply add to profitBalance, a negative profit is a loss.
                        // Let's stick to type "PROFIT" but checks context? 
                        // Actually, looking at `api/user/dashboard`, it just displays the type.
                        // "PROFIT" (-$50) looks weird.
                        // Let's use "PROFIT" for gains and maybe "TRADING_LOSS" for loss?
                        // Or just "PROFIT" and allow negative amounts?
                        // Let's use "TRADING_RESULT" or just "PROFIT" (implies PnL).
                        // I will use "PROFIT" but with signed amount for the wallet Update, 
                        // but for Transaction record, clarity helps. 
                        // Let's use "PROFIT" for positive and "LOSS" for negative if schema allows string.
                        // Schema type is String. So I can allow "LOSS".
                        type: amount >= 0 ? "PROFIT" : "LOSS",
                        amount: txnAmount,
                        status: "COMPLETED",
                        reference: `Daily PnL: ${percentVal}%`
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
