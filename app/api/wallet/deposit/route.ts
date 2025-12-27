import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    return NextResponse.json({ status: "Deposit Service Ready" });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, type, method } = body;
        console.log(`Deposit Request: ${method}, Amount: ${amount}`);

        // 1. Get User from Session
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.userId;

        // 2. Fetch User & Wallet
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { wallet: true }
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ error: "Wallet not found for user" }, { status: 404 });
        }

        // 3. Determine Status & Update
        const isSimulation = method === "CARD_SIMULATION";
        const status = isSimulation ? "COMPLETED" : "PENDING";

        // Use interactive transaction to update balance if confirmed
        const result = await prisma.$transaction(async (tx: any) => {
            const transaction = await tx.transaction.create({
                data: {
                    walletId: user.wallet!.id,
                    type: "DEPOSIT",
                    amount: parseFloat(amount),
                    status: status,
                    reference: `REF-${Date.now()}`
                }
            });

            if (isSimulation) {
                await tx.wallet.update({
                    where: { id: user.wallet!.id },
                    data: {
                        mainBalance: { increment: parseFloat(amount) }
                    }
                });
            }

            return transaction;
        });

        // NOTE: For non-simulated, Admin must approve manually.

        return NextResponse.json({ success: true, transaction: result });

    } catch (error) {
        console.error("Deposit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

