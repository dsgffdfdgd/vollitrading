import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: List all pending deposits
export async function GET() {
    console.log("Admin: Fetching pending deposits...");
    try {
        const pendingDeposits = await prisma.transaction.findMany({
            where: {
                type: "DEPOSIT",
                status: "PENDING"
            },
            include: {
                wallet: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(pendingDeposits);
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
    }
}

// PUT: Approve a deposit
export async function PUT(req: Request) {
    try {
        const { transactionId, action } = await req.json(); // action: 'APPROVE' or 'REJECT'

        if (!transactionId || !action) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { wallet: true }
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status !== "PENDING") {
            return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });
        }

        if (action === "APPROVE") {
            console.log("Approving Transaction:", transactionId);
            console.log("Transaction Details:", transaction);
            console.log("Target Wallet ID:", transaction.walletId);
            console.log("Adding Amount:", transaction.amount);

            // Update transaction and wallet balance atomically
            try {
                const result = await prisma.$transaction([
                    prisma.transaction.update({
                        where: { id: transactionId },
                        data: { status: "COMPLETED" } // or APPROVED
                    }),
                    prisma.wallet.update({
                        where: { id: transaction.walletId },
                        data: {
                            mainBalance: { increment: transaction.amount }
                        }
                    })
                ]);
                console.log("Approve Transaction Result:", result);
                return NextResponse.json({ success: true, message: "Deposit Approved" });
            } catch (txError) {
                console.error("Transaction Commit Failed:", txError);
                return NextResponse.json({ error: "Database update failed" }, { status: 500 });
            }
        }

        if (action === "REJECT") {
            await prisma.transaction.update({
                where: { id: transactionId },
                data: { status: "FAILED" } // or REJECTED
            });
            return NextResponse.json({ success: true, message: "Deposit Rejected" });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

    } catch (error) {
        console.error("Admin Action Error:", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}
