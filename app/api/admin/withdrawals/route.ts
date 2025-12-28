import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
const ADMIN_EMAIL = "allankipkoech65@gmail.com";

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
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const withdrawals = await prisma.transaction.findMany({
            where: {
                type: "WITHDRAWAL",
                status: "PENDING"
            },
            include: {
                wallet: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(withdrawals);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { transactionId, action } = await req.json();

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { wallet: true }
        });

        if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        if (transaction.status !== "PENDING") return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });

        if (action === "APPROVE") {
            // Funds were already deducted on request. Just mark complete.
            await prisma.transaction.update({
                where: { id: transactionId },
                data: { status: "COMPLETED" }
            });
            return NextResponse.json({ success: true, message: "Withdrawal approved" });

        } else if (action === "REJECT") {
            // Refund the user
            await prisma.$transaction([
                prisma.wallet.update({
                    where: { id: transaction.walletId },
                    data: {
                        profitBalance: { increment: transaction.amount }
                    }
                }),
                prisma.transaction.update({
                    where: { id: transactionId },
                    data: { status: "REJECTED" }
                })
            ]);
            return NextResponse.json({ success: true, message: "Withdrawal rejected and refunded" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: "Process failed" }, { status: 500 });
    }
}
